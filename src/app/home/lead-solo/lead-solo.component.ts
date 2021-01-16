// selected lead is the lead returned from the server which will only have keys that have data associated
// with them, use objectKeys(typedict) instead

import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { CampaignService } from "../campaign.service";
import {
  ClassValidationError,
  ModelInterface,
} from "../interfaces/global.interfaces";
import { ILead } from "../interfaces/leads.interface";
import { LeadsService } from "../leads.service";
import { Plugins, CameraResultType, CameraSource } from "@capacitor/core";
import { UsersService } from "../users.service";
import { ICampaign } from "src/app/campaign/campaign.interface";
import { field } from "src/global.model";
import { NzTreeNode } from "ng-zorro-antd/tree";
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
const { Geolocation, Camera } = Plugins;
import { en_US, ToastService } from "ng-zorro-antd-mobile";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
} from "@ionic-native/contacts/ngx";
import * as moment from "moment";

import { difference, isEmpty, isString } from "lodash";
import { UploadService } from "src/app/upload.service";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { ActionSheetController, LoadingController, Platform, ToastController } from "@ionic/angular";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GeomarkerComponent } from "src/app/geomarker/geomarker.component";
import { DomSanitizer } from "@angular/platform-browser";
import { CountdownComponent } from "ngx-countdown";
import { EAutodial } from "./autodial.interface";
import { CallLog } from '@ionic-native/call-log/ngx';
import { ICallRecord } from "./call-record.interface";
import { environment } from "src/environments/environment";

declare let PhoneCallTrap: any;

defineCustomElements(window);

@Component({
  selector: "app-lead-solo",
  templateUrl: "./lead-solo.component.html",
  styleUrls: ["./lead-solo.component.scss"],
})
export class LeadSoloComponent implements OnInit {
  constructor(
    private leadsService: LeadsService,
    private campaignService: CampaignService,
    private fb: FormBuilder,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private callNumber: CallNumber,
    private contacts: Contacts,
    private uploadService: UploadService,
    private actionSheetCtrl: ActionSheetController,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private callLog: CallLog,
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) {}

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  modelFields: Array<field> = [];
  isEmpty = isEmpty;
  formModel: ModelInterface = {
    name: "App name...",
    description: "App Description...",
    theme: {
      bgColor: "ffffff",
      textColor: "555555",
      bannerImage: "",
    },
    attributes: this.modelFields,
  };

  selectedCampaignId: string;
  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "date";
  loadingCampaignList = false;
  campaignList: ICampaign[] = [];
  callDispositions: any;
  isVisible = false;
  jsonStringify = JSON.stringify;
  locale = en_US;

  ngOnInit(): void {
    /** @Todo we dont have to fetch the entire list of campaigns here, only the campaign whose id was provided in the query params
     * coming from list campaigns page .....
     */

    this.populateCampaignDropdown("");
    this.initEmailForm();
    this.fetchUsersForReassignment();
    this.initContactForm();
    this.initCallTrap();
  }


  initCallTrap() {
    if(environment.platform !== 'web') {
      PhoneCallTrap.onCall(state => {
        switch (state) {
            case "RINGING":
                break;
            case "OFFHOOK":
                  break;
      
            case "IDLE":
                console.log("PhoneCallTrap idle state :: printing logs");
                this.platform.ready().then(() => {
  
                  this.callLog.hasReadPermission().then(hasPermission => {
                    if (!hasPermission) {
                      this.callLog.requestReadPermission().then(results => {
                        this.getPhoneCallLogs();
                      }).catch(e => alert(" requestReadPermission " + JSON.stringify(e)));
                    } else {
                      this.getPhoneCallLogs();
                    }
                  }).catch(e => alert(" hasReadPermission " + JSON.stringify(e)));
                });
                break;
          }
      });
    }  
  }


  callRecord: ICallRecord;
  async getPhoneCallLogs() {
    if(this.selectedLead && this.callTime) {
      const record:ICallRecord[] = await this.callLog.getCallLog([{
        name: "date",
        value: this.callTime,
        operator: ">=",
      }]);
      
      this.callRecord = record[0];
    }
  }

  contactForm!: FormGroup;
  initContactForm() {
    this.contactForm = this.fb.group({
      label: [null, [Validators.required]],
      value: [null, [Validators.required]],
      category: ['mobile', [Validators.required]],
    });
  }

  callTime: string;
  onPhoneClick(number: string) {
    if(number?.length<=10 && !number.startsWith('+')) {
      number = '+91' + number;

      number = number.toString().trim();
    }

    this.callTime = new Date().getTime().toString();
    this.callNumber
      .callNumber(number, true)
      .then((res) => {console.log("Launched dialer!", res) })
      .catch((err) => console.log("Error launching dialer", err));
  }

  selectedCampaign: ICampaign;
  subscribeToQueryParamChange() {
    this.activatedRoute.queryParams.subscribe(
      async (data) => {
        this.selectedCampaignId = data.campaignId;

        await this.getLeadMappings();
        this.getDispositionForCampaign();

        // if leadId is sent from leads component ts then fetch that lead, also once lead is fetched clear the query params
        if (data.leadId) {
          this.fetchLeadById(data.leadId);
        } else {
          this.fetchNextLead();
        }
        console.log("logging query params", data);
      },
      (error) => {
        // this.toast.fail("Error in subscribing to query params");
      }
    );
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }

  /** @Todo remove this, we are not populating list of campaigns */
  populateCampaignDropdown(filter) {
    this.loadingCampaignList = true;
    this.campaignService.getCampaigns(1, 20, filter, "", "asc").subscribe(
      (result: any) => {
        this.loadingCampaignList = false;
        this.campaignList = result.data;
        this.subscribeToQueryParamChange();
      },
      (error) => {
        this.loadingCampaignList = false;
        console.log(error);
      }
    );
  }

  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaignId).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // leadStatusOptions: string[];
  // selectedLeadStatus: string;
  enabledKeys;
  contactGroup: {label: string, value: string[], _id: string};
  leadGroups: { label: string; value: string[]; _id: string }[] = [];
  allLeadKeys: string[] = []
  async getLeadMappings() {
    const { typeDict, mSchema } = await this.leadsService.getLeadMappings(
      this.selectedCampaignId
    );

    console.log(mSchema);
    mSchema.paths.forEach(p=>{
      this.allLeadKeys.push(p.internalField);
    });

    
    const campaignObject = this.campaignList.filter(
      (element) => element._id === this.selectedCampaignId
    );

    /** modified on Dec 17 please verify if it breaks anything */
    this.selectedCampaign = campaignObject[0];
    this.openAutodial();

    this.leadGroups = this.selectedCampaign?.groups;
    this.contactGroup = this.leadGroups.filter(g=>g.label === 'contact')[0];
    this.formModel = campaignObject[0]?.formModel;

    this.enabledKeys = campaignObject[0]?.editableCols;
    this.typeDict = typeDict;
    this.evaluateOtherData();
    this.populateEmailTemplateDropdown(campaignObject[0]);
  }

  populateEmailTemplateDropdown(campaignObj: ICampaign) {
    this.campaignService.getAllEmailTemplates(campaignObj._id).subscribe(
      (data) => {
        this.emailTemplates = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isDisabled(leadKey: string) {
    if (this.enabledKeys?.includes(leadKey)) {
      return false;
    }
    return true;
  }

  handleEvent(e) {
    console.log(e)
  }

  async handleLeadSubmission(lead: ILead, fetchNextLead: boolean) {
    const geoLocation = await Geolocation.getCurrentPosition();
    const updateObj = {
      lead,
      geoLocation: {
        coordinates: [
          geoLocation.coords.latitude,
          geoLocation.coords.longitude,
        ],
      },
      requestedInformation: this.formModel.attributes.map((fld) => {
        return {
          [fld.label]: fld.value,
        };
      }),
      campaignId: this.selectedCampaign._id
    };

    if (this.selectedUserForReassignment) {
      updateObj["reassignmentInfo"] = this.selectedUserForReassignment;
    }

    updateObj["emailForm"] = this.emailForm.value;

    /** @Todo such cases should be covered in not connected */
    updateObj["callRecord"] = {
      number: this.callRecord?.number || 0,
      duration: this.callRecord?.duration || 0,
      type: this.callRecord?.type || 2
    };

    // any condition that has to be validated before submitting the form goes into this;
    const preApproveResult = this.checkSubmissionStatus();
    if (!preApproveResult.status) {
      const toast = await this.toastController.create({
        message: preApproveResult.message,
        duration: 1000
      });

      toast.present();
      return;
    }
    
    /** @Todo change this logic into something more manageable
     * 
     */
    // await this.handleDocumentUpload()
    let documentLinks = this.uploadedDocsLink;
    documentLinks = []
    updateObj.lead.documentLinks = documentLinks;
    // 
    this.leadsService.updateLead(lead._id, updateObj).subscribe(
      (data) => {
        // clean user reassigment once done
        this.selectedUserForReassignment = null;
        // this.toast.success("Successfully updated lead");
        if (fetchNextLead) {
          this.fetchNextLead();
        }
      },
      ({ error }: { error: ClassValidationError }) => {
        // this.toast.fail(error.message[0]);
      }
    );
  }

  getSafeWhatsAppUrl(phoneNumber: string) {
    if(phoneNumber.length<=10 && !phoneNumber.startsWith('+')) {
      phoneNumber = '+91'
    }
    return this._sanitizer.bypassSecurityTrustUrl(`whatsapp://send?phone=${phoneNumber}`);
  }

  browsableState = false;
  openAutodial() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if(queryParams.isBrowsed) {
      this.browsableState = true;
      return;
    }

    const dialogRef = this.dialog.open(LeadAutodial, {
      disableClose: true,
      data: {
        autodialSettings: this.selectedCampaign.autodialSettings
      }
    });


    dialogRef.afterClosed().subscribe((result: {event: EAutodial, data: any})=>{
      if(result.event === EAutodial.callNumber) {
        console.log("calling number", this.selectedLead.mobilePhone);
        this.onPhoneClick(this.selectedLead.mobilePhone)
      }
    })
  }

  openMap(coordinates) {
    this.dialog.open(GeomarkerComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {
        coordinates: [{lat: coordinates[0], lng: coordinates[1]}]
      }
    });
  }

  checkSubmissionStatus(): {status: boolean, message: string} {
    // validate form
    if (this.actions.isInformationRequested) {
      for (let element of this.formModel.attributes) {
        if (element.required && !element.value) {
          return { status: false, message: `${element.label} is a required field` };
        }
      }
    }

    if((this.actions.followUp || this.actions.salesCall || this.actions.appointment) && !this.selectedLead.followUp) {
      return {status: false, message: "Followup is required!"};
    }

    if(this.actions.salesCall) {
      return {status: false, message: "SalesCall is required!"};
    }

    if(this.actions.appointment) {
      return {status: false, message: "Appointment is required!"};
    }

    return {status: true, message: "All validation checks passed!"};
  }

  actions = {
    isInformationRequested: false,
    salesCall: false,
    appointment: false,
    followUp : false,
  };

  getLinks(node: NzTreeNode): string[] {
    const links = [];
    while (node.parentNode !== null) {
      links.push(node.origin.title);
      node = node.parentNode;
    }

    return links;
  }

  showFab = false;
  followUpAction = false;
  showFollowUpInput = false;
  handleDispositionTreeEvent(event) {
    // ["followUp", "appointment", "salesCall"]
    if (event.node.isLeaf) {
      const links = this.getLinks(event.node);
      this.selectedLead.leadStatus = links.reverse().join(" / ");
      this.selectedLead["leadStatusKeys"] = event.node.origin.key;
      const action = event.node.origin.action;
      if(action[0] !== 'showForm') {
        this.selectedLead.nextAction = action[0];
      }else{
        this.selectedLead.nextAction = action[1]
      }

      this.resetAllActionHandlers();
      if (action?.includes("followUp")) {
        this.actions.followUp = true;
      }

      if (action?.includes("appointment")) {
        this.actions.appointment = true;
      }

      if (action?.includes("salesCall")) {
        this.actions.salesCall = true;
      }

      if (action?.includes("showForm")) {
        this.actions.isInformationRequested = true;
      }
      // this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    
      event.node.isExpanded = !event.node.isExpanded;
    }else{
      event.node.isExpanded = !event.node.isExpanded;
    }
  }


  today = new Date().toISOString();
  handleFollowUp(event) {
    if (event.value == 1) {
      this.selectedLead.followUp = moment().toDate();
    } else if (event.value == 2) {
      // after 10 mins
      this.selectedLead.followUp = moment().add(10, "minutes").toDate();
    } else if (event.value == 3) {
      // 1 hr
      this.selectedLead.followUp = moment().add(1, "hour").toDate();
    } else if (event.value == 4) {
      // tomorrow
      this.selectedLead.followUp = moment().add(24, "hours").toDate();
    }
  }

  fabTransition() {
    console.log("transition");
  }

  resetAllActionHandlers() {
    Object.keys(this.actions).forEach((action) => {
      this.actions[action] = false;
    });
  }

  handleLeadStatusChange(event) {}

  showAppliedFiltersOnNoResult = false;
  fetchNextLead() {
    this.showAppliedFiltersOnNoResult = false;
    // this.toast.loading("Fetching next lead");
    this.leadsService
      .fetchNextLead(this.selectedCampaignId, this.typeDict, this.leadFilter)
      .subscribe(
        (data: any) => {
          // this.toast.hide();
          this.selectedLead = data.lead;
          if (!this.selectedLead) {
            this.showAppliedFiltersOnNoResult = true;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  selectedLeadHistory = [];
  fetchLeadById(id: string) {
    // this.toast.info("Fetching lead");
    this.leadsService.getLeadById(id).subscribe(
      (data: {lead: ILead, leadHistory: any[]}) => {
        // this.toast.hide();
        this.selectedLead = data.lead;
        this.selectedLeadHistory = data.leadHistory;
      },
      (err) => {
        // this.toast.hide();
        console.log(err);
      }
    );
  }

  emailForm: FormGroup;
  emailTemplates: any;
  tempObj: any = {};
  emailModel;
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      content: [null],
      attachments: [null],
    });
  }

  attachments: any[] = [];

  submitEmailForm(model) {
    console.log(model);
  }

  selectedEmailTemplate: any;
  populateEmailModal(event) {
    this.selectedEmailTemplate = event;

    this.attachments = this.selectedEmailTemplate.attachments;
    this.emailForm.patchValue({
      subject: this.selectedEmailTemplate.subject,
      content: this.selectedEmailTemplate.content,
    });
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  showFilterDrawer = false;
  leadFilter = {} as any;
  openFilterDrawer(): void {
    console.log(this.typeDict);
    this.showFilterDrawer = true;
  }

  closeFilterDrawer(): void {
    this.showFilterDrawer = false;
  }

  printFilters() {
    console.log(this.leadFilter);
  }

  handleTagRemoval(tag) {
    delete this.leadFilter[tag];
    this.fetchNextLead();
  }

  isLeadEditMode = false;
  showLeadDetails() {
    this.isLeadEditMode = !this.isLeadEditMode;
  }

  isReassignmentDrawerVisible = false;
  showReassignmentDrawer() {
    this.isReassignmentDrawerVisible = true;
  }

  closeReassignmentDrawer() {
    this.isReassignmentDrawerVisible = false;
  }

  selectedUserForReassignment = null;
  selectUserForReassignment(user: {
    email: string;
    _id: string;
    fullname: string;
  }) {
    this.selectedUserForReassignment = user;
  }

  onCampaignFormUpdate(event) {
    this.formModel = event;
  }

  historyLimit = 1;
  onShowMoreClick() {
    this.historyLimit = this.historyLimit === 1 ? 100 : 1;
  }

  isContactDrawerVisible = false;
  showContactDrawer() {
    this.isContactDrawerVisible = true;
  }

  hideContactDrawer() {
    this.isContactDrawerVisible = false;
  }

  submitContactForm(addNext: boolean) {
    for (const i in this.contactForm.controls) {
      this.contactForm.controls[i].markAsDirty();
      this.contactForm.controls[i].updateValueAndValidity();
    }

    /** @Todo validate form before submitting, also add backend validation */
    console.log(this.contactForm.value, this.selectedLead.contact);

    // in case backend sends an empty array, should not happen but is possible sometimes
    this.selectedLead.contact = this.selectedLead.contact || [];
    this.selectedLead.contact.push(this.contactForm.value);


    this.leadsService
      .addContact(this.selectedLead._id, this.contactForm.value)
      .subscribe(
        (success) => {
          let contact: Contact = this.contacts.create();

          contact.name = new ContactName(
            null,
            this.contactForm.get("label").value,
            ""
          );
          contact.phoneNumbers = [
            new ContactField("mobile", this.contactForm.get("value").value),
          ];
          contact.save().then(
            () => {
              // this.toast.info("saved to phone")
            },
            (error: any) => { 
              // this.toast.info("Error saving contact to phone") 
            }
          );

          // this.toast.success("Updated contact information");
        },
        (error) => {
          this.selectedLead.contact.pop();
          // this.toast.fail("Failed to update contact information");
        }
      );

    /** @Todo check for form errors */
    if (addNext) {
      return this.contactForm.reset();
    }

    this.isContactDrawerVisible = false;
  }

  name = "shanur";
  value = new Date();

  currentDateFormat(date, format: string = "yyyy-mm-dd HH:MM"): any {
    const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
    return format
      .replace("yyyy", date.getFullYear())
      .replace("mm", pad(date.getMonth() + 1))
      .replace("dd", pad(date.getDate()))
      .replace("HH", pad(date.getHours()))
      .replace("MM", pad(date.getMinutes()))
      .replace("ss", pad(date.getSeconds()));
  }

  onOk(result: Date) {
    this.name = this.currentDateFormat(result);
    this.value = result;
  }

  formatIt(date: Date, form: string) {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    if (form === "YYYY-MM-DD") {
      return dateStr;
    }
    if (form === "HH:mm") {
      return timeStr;
    }
    return `${dateStr} ${timeStr}`;
  }

  handleDateOpenChange(event) {}
  handleDatePanelChange(event) {}


  defaultContactValue = "mobile"
  getInputType(readableType) {
    if(readableType.type === 'string') {
      return 'text';
    }
    return readableType.type;
  }


  isEmail(s) {
    return isString(s) && s.indexOf("@") > 0;
  }

  isMobile(m) {
    if(!m)
      return false;
    const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(m);
  }


  showOtherData = false;
  otherData = [];
  evaluateOtherData() {
    this.showOtherData = !this.showOtherData;

    if (!this.showOtherData) {
      this.selectedCampaign.groups = this.selectedCampaign.groups.filter(
        (g) => g.label !== "More"
      );
      return;
    }

    let alreadyIncluded: string[] = [];
    this.selectedCampaign.groups.forEach((g) => {
      alreadyIncluded = alreadyIncluded.concat(g.value);
    });

    this.otherData = difference(
      this.objectkeys(this.typeDict),
      alreadyIncluded
    );

    this.selectedCampaign.groups.push({
      label: "More",
      value: this.otherData,
      _id: "0",
    });
  }


  uploadedDocsLink = [];
  docsUploaded = false;
  uploading = false;
  async handleDocumentUpload(file: File): Promise<void> {
    const { Location } = await this.uploadService.uploadFile("attachments", file);
    this.uploadedDocsLink.push(Location);
  } 

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 20,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source
    });
 
    this.uploadService.getFileFromUri(image.webPath).subscribe(async file=>{
      const timestamp = new Date().getTime();
      const result:any = await this.uploadService.uploadArrayBuffer(file, `${timestamp}.${image.format}`);
      this.uploadedDocsLink.push(result.Location);
    })
  }

  async selectImageSource() {
    const buttons = [
      {
        text: "Take Photo",
        icon: "camera",
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: "Choose From Photos Photo",
        icon: "image",
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
      {
        text: "Choose a File",
        icon: "attach",
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      },
    ];
 
    // Only allow file selection inside a browser
    
  
 
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }


  assignTo(user) {
    console.log(this.selectedLead.email, user.email, this.selectedLead);
    this.leadsService.reassignLead(this.selectedLead.email, user.email, this.selectedLead).subscribe(data=>{
      console.log(data);
    }, error=>{
      console.log(error);
    });
  }


  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
 
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
 
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
 
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
 
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  blobToFile(theBlob: Blob, fileName:string): File {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
}


interface ICountdown {
  action: string,
  left: number,
  status: number,
  text: string
}
@Component({
  selector: 'lead-countdown-dialog',
  templateUrl: './lead-countdown-dialog.html',
})
export class LeadAutodial implements OnInit{
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pick<ICampaign, 'autodialSettings'>,
    public dialogRef: MatDialogRef<LeadAutodial>,
    private router: Router,
  ) {}

  ngOnInit() {
    console.log(this.data.autodialSettings);
  }

  navigateToCampaignList() {
    this.dialogRef.close();
    this.router.navigate(["home", "campaign", "list"]);
  }

  handleCountdown(e: ICountdown) {
    if(e.action === 'done') {
      this.dialogRef.close({event: EAutodial.callNumber, data:{}});
    }
  }
}
