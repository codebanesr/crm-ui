// selected lead is the lead returned from the server which will only have keys that have data associated
// with them, use objectKeys(typedict) instead

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

import { CampaignService } from "../campaign.service";
import {
  ClassValidationError,
  ModelInterface,
} from "../interfaces/global.interfaces";
import { ILead } from "../interfaces/leads.interface";
import { LeadsService } from "../leads.service";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";

import { UsersService } from "../users.service";
import { ICampaign } from "src/app/campaign/campaign.interface";
import { field } from "src/global.model";
import { NzTreeNode } from "ng-zorro-antd/tree";
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
} from "@ionic-native/contacts/ngx";
import * as moment from "moment";

import { difference, isEmpty, isString, cloneDeep } from "lodash";
import { UploadService } from "src/app/upload.service";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import {
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { GeomarkerComponent } from "src/app/geomarker/geomarker.component";
import { DomSanitizer } from "@angular/platform-browser";
import { CountdownComponent } from "ngx-countdown";
import { EAutodial } from "./autodial.interface";
import { CallLog } from "@ionic-native/call-log/ngx";
import { ICallRecord } from "./call-record.interface";
import { environment } from "src/environments/environment";
import { ECallStatus } from "../interfaces/call-status.enum";

import { ILeadHistory } from "./lead-history.interface";
import { MatAccordion } from "@angular/material/expansion";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ReassignmentDrawerSheetComponent } from "./reassignment-drawer/reassignment-drawer.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "../interfaces/user";
import { PubsubService } from "src/app/pubsub.service";
import { HEADER_FILTERS } from "src/global.constants";
import { MatSidenav } from "@angular/material/sidenav";
import { AuthenticationService } from "src/authentication.service";

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
    private callNumber: CallNumber,
    private contacts: Contacts,
    private uploadService: UploadService,
    private actionSheetCtrl: ActionSheetController,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private callLog: CallLog,
    private platform: Platform,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private pubsub: PubsubService,
    private authService: AuthenticationService
  ) {}

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  modelFields: Array<field> = [];
  isLeadEmpty = false;
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

  selectedLead: ILead;
  typeDict: any;
  objectkeys = Object.keys;
  dateMode: string = "date";
  loadingCampaignList = false;
  callDispositions: any;
  isVisible = false;
  jsonStringify = JSON.stringify;

  loading: boolean = false;

  ngOnInit() {
    /** @Todo we dont have to fetch the entire list of campaigns here, only the campaign whose id was provided in the query params
     * coming from list campaigns page .....
     */
    this.initEmailForm();
  }

  ionViewWillEnter() {
    this.initHeaderPanel();
    this.fetchUsersForReassignment();
    this.subscribeToQueryParamChange();
    try {
      this.initCallTrap();
    }catch(e) {
      console.log("PhoneCallTrap error", e);
    }
  }

  @ViewChild('drawer') drawer: MatSidenav;

  initHeaderPanel() {
    this.pubsub.$pub(HEADER_FILTERS, [
      {
        iconName: "filter_alt",
        onIconClick: () => {
          this.drawer.toggle();
        }
      },{
        iconName: "add",
        onIconClick: () => {
          this.createLead();
        }
      }
    ]);
  }

  createLead() {
    this.router.navigate(["home", "lead-create"], {
      queryParams: {
        campaignId: this.selectedCampaign._id,
        email: this.authService.currentUserValue._id
      }
    });
  }
  


  onLeadCreate() {
    this.router.navigate(["home", "lead-create"], {
      queryParams: {
        campaignId: this.selectedCampaign._id,
      },
    });
  }

  initCallTrap() {
    if (environment.platform !== "web") {
      PhoneCallTrap?.onCall((state) => {
        switch (state) {
          case "RINGING":
            break;
          case "OFFHOOK":
            break;

          case "IDLE":
            this.platform.ready().then(() => {
              this.callLog
                .hasReadPermission()
                .then((hasPermission) => {
                  if (!hasPermission) {
                    this.callLog
                      .requestReadPermission()
                      .then((results) => {
                        this.getPhoneCallLogs();
                      })
                      .catch((e) =>
                        alert(" requestReadPermission " + JSON.stringify(e))
                      );
                  } else {
                    this.getPhoneCallLogs();
                  }
                })
                .catch((e) => alert(" hasReadPermission " + JSON.stringify(e)));
            });
            break;
        }
      });
    }
  }

  callRecord: ICallRecord;
  async getPhoneCallLogs() {
    if (this.selectedLead && this.callTime) {
      const record: ICallRecord[] = await this.callLog.getCallLog([
        {
          name: "number",
          value: this.selectedLead.mobilePhone,
          operator: "==",
        },
      ]);
      // console.log("CALL_RECORD_STATS_CAPTURED", this.selectedLead.mobilePhone, JSON.stringify(record[0]), JSON.stringify(record));
      this.callRecord = record[0];
    }
  }

  callTime: string;
  onPhoneClick(number: string) {
    if (number?.length <= 10 && !number.startsWith("+")) {
      number = "+91" + number;

      number = number.toString().trim();
    }

    // we are now doing it from the pwa
    // this.callTime = new Date().getTime().toString();
    // this.callNumber
    //   .callNumber(number, true)
    //   .then((res) => {})
    //   .catch((err) => {});
  }

  selectedCampaign: ICampaign;
  subscribeToQueryParamChange() {
    // const t = timer(300);
    this.activatedRoute.queryParams
      // .pipe(takeUntil(t), takeLast(1))
      .subscribe(
        async (data) => {
          this.selectedCampaign = await this.campaignService.getCampaignById(data.campaignId).toPromise();
          this.browsableState = data.isBrowsed ? true : false;
          await this.getLeadMappings();
          this.initTabDetails();
          this.getDispositionForCampaign();

          // if leadId is sent from leads component ts then fetch that lead, also once lead is fetched clear the query params
          if (data.leadId) {
            this.fetchLeadById(data.leadId);
          } else {
            this.fetchNextLead();
          }
        },
        async (error) => {}
      );
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }


  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaign._id).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {}
    );
  }

  // leadStatusOptions: string[];
  // selectedLeadStatus: string;
  enabledKeys: string[] = [];
  contactGroup: { label: string; value: string[]; _id: string };
  leadGroups: { label: string; value: string[]; _id: string }[] = [];
  allLeadKeys: string[] = [];
  async getLeadMappings() {
    // preventing duplicate keys from coming up
    this.allLeadKeys = [];
    const obj = await this.leadsService.getLeadMappings(
      this.selectedCampaign._id
    );

    obj.mSchema.paths.forEach((p) => {
      this.allLeadKeys.push(p.internalField);
    });

    this.typeDict = obj.typeDict;

    this.recreatePageState();
  }

  recreatePageState() {
    this.formModel = cloneDeep(this.selectedCampaign?.formModel);
  }


  initTabDetails() {
    this.contactGroup = this.selectedCampaign.groups.filter((g) => g.label === "contact")[0];
    this.enabledKeys = this.selectedCampaign?.editableCols || [];
    this.evaluateOtherData();
    this.populateEmailTemplateDropdown(this.selectedCampaign);
  }


  populateEmailTemplateDropdown(campaignObj: ICampaign) {
    this.campaignService.getAllEmailTemplates(campaignObj._id).subscribe(
      (data) => {
        this.emailTemplates = data;
      },
      (error) => {}
    );
  }

  isDisabled(leadKey: string) {
    if (this.enabledKeys?.includes(leadKey)) {
      return false;
    }
    return true;
  }

  handleEvent(e) {}

  @ViewChild(MatAccordion) accordion: MatAccordion;
  async handleLeadSubmission(lead: ILead, fetchNextLead: boolean) {
    this.loading = true;
    let geoLocation;


    let updateObj = {
      lead,
      geoLocation: {
        coordinates: [
          0,
          0,
        ],
      },
      requestedInformation: this.formModel.attributes.map((fld) => {
        return {
          [fld.label]: fld.value,
        };
      }),
      campaignId: this.selectedCampaign._id,
    };



    try {
      geoLocation = await Geolocation.getCurrentPosition();
      updateObj = {
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
        campaignId: this.selectedCampaign._id,
      };
    }catch(e) {
      console.log("Location has been turned off by the user");
      // this.loading = false;
      // this._snackBar.open('Please enable GPS to save lead!', 'cancel', {
      //   duration: 2000,
      //   horizontalPosition: 'center',
      //   verticalPosition: 'top'
      // })
    }


    if(this.reassignToUser) {
      updateObj['reassignToUser'] = this.reassignToUser;
      this.reassignToUser = null; /** @Todo done twice, once after upload */
    }

    updateObj["emailForm"] = this.emailForm.value;

    /** @Todo such cases should be covered in not connected */
    updateObj["callRecord"] = {
      number: this.callRecord?.number || 0,
      duration: this.callRecord?.duration || 0,
      type: this.callRecord?.type || 2,
    };

    // call status addition
    if (this.callRecord?.duration > 0) {
      updateObj["callStatus"] = ECallStatus.answered;
    } else if (this.callRecord?.duration === 0) {
      updateObj["callStatus"] = ECallStatus.unknown;
    } else {
      updateObj["callStatus"] = ECallStatus.unanswered;
    }

    // any condition that has to be validated before submitting the form goes into this;
    const preApproveResult = this.checkSubmissionStatus();
    if (!preApproveResult.status) {
      this.loading = false;
      this._snackBar.open(preApproveResult.message, 'cancel', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      })
      return;
    }

    /** @Todo change this logic into something more manageable
     *
     */
    // await this.handleDocumentUpload()
    let documentLinks = this.uploadedDocsLink;
    updateObj.lead.documentLinks = documentLinks;

    this.leadsService.updateLead(lead._id, updateObj).subscribe(
      (data) => {
        this.loading = false;
        this.reassignToUser = null;
        this._snackBar.open('Successfully updated lead', 'cancel', {duration: 2000, verticalPosition: 'top'});
        if (fetchNextLead) {
          this.accordion.closeAll();
          this.fetchNextLead();
        } else{
          this.router.navigate(['home']);
        }
      },
      ({ error }: { error: ClassValidationError }) => {
        this.loading = false;
      }
    );
  }

  getSafeWhatsAppUrl(phoneNumber = "") {
    // if (phoneNumber.length < 10 && !phoneNumber.startsWith("+")) {
    //   phoneNumber = "+91";
    // }
    if(phoneNumber.startsWith("+91")) {
      phoneNumber = phoneNumber.substring(3);
    }
    return this._sanitizer.bypassSecurityTrustUrl(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Hi!`
    );
  }

  browsableState = false;
  openAutodial() {
    if (this.browsableState) {
      return;
    }

    const dialogRef = this.dialog.open(LeadAutodial, {
      disableClose: true,
      data: {
        autodialSettings: this.selectedCampaign.autodialSettings,
      },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { event: EAutodial; data: any }) => {
        if (result.event === EAutodial.callNumber) {
          this.onPhoneClick(this.selectedLead.mobilePhone);
        }
      });
  }

  openMap(coordinates) {
    this.dialog.open(GeomarkerComponent, {
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "100%",
      width: "100%",
      data: {
        coordinates: [{ lat: coordinates[0], lng: coordinates[1] }],
      },
    });
  }

  navigateToTransactions() {
    this.router.navigate(["home", "transactions"], {
      queryParams: {
        leadId: this.selectedLead._id,
      },
    });
  }

  checkSubmissionStatus(): { status: boolean; message: string } {
    // validate form
    if (!this.selectedLead.leadStatus) {
      return { status: false, message: "Disposition cannot be empty" };
    }
    if (this.actions.isInformationRequested) {
      for (let element of this.formModel.attributes) {
        if (element.required && !element.value) {
          return {
            status: false,
            message: `${element.label} is a required field`,
          };
        }
      }
    }

    if (
      (this.actions.followUp ||
        this.actions.salesCall ||
        this.actions.appointment) &&
      !this.selectedLead.followUp
    ) {
      return { status: false, message: "Followup is required!" };
    }

    if (this.actions.salesCall && !this.selectedLead.followUp) {
      return { status: false, message: "SalesCall is required!" };
    }

    if (this.actions.appointment && !this.selectedLead.followUp) {
      return { status: false, message: "Appointment is required!" };
    }

    return { status: true, message: "All validation checks passed!" };
  }

  actions = {
    isInformationRequested: false,
    salesCall: false,
    appointment: false,
    followUp: false,
  };

  getLinks(node: NzTreeNode): string[] {
    const links = [];
    while (node.parentNode !== null) {
      links.push(node.origin.title);
      node = node.parentNode;
    }

    if(node.parentNode === null && node.origin.title) {
      links.push(node.origin.title);
    }
    return links;
  }

  showFab = false;
  followUpAction = false;
  showFollowUpInput = false;
  prevSelectedNode: NzTreeNode;
  handleDispositionTreeEvent(event) {
    this.prevSelectedNode = event.node;
    // ["followUp", "appointment", "salesCall"]
    if (event.node.isLeaf) {
      const links = this.getLinks(event.node);
      this.selectedLead.leadStatus = links.reverse().join(" / ");
      this.selectedLead["leadStatusKeys"] = event.node.origin.key;
      const action = event.node.origin.action;
      if (action && action[0] !== "showForm") {
        this.selectedLead.nextAction = action[0];
      } else if (action) {
        this.selectedLead.nextAction = action[1];
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
    } else {
      event.node.isExpanded = !event.node.isExpanded;
    }
  }

  today = new Date().toISOString();
  followUpSelection: any;
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

  appendTimeZone() {
    this.selectedLead.followUp = moment(this.selectedLead.followUp).toISOString();
    console.log(this.selectedLead.followUp)
  }
  fabTransition() {}

  resetAllActionHandlers() {
    Object.keys(this.actions).forEach((action) => {
      this.actions[action] = false;
    });
  }

  handleLeadStatusChange(event) {}

  showAppliedFiltersOnNoResult = false;
  async fetchNextLead() {
    !this.loading && (this.loading = true);
    this.showAppliedFiltersOnNoResult = false;
    /** @Todo do some more research on pipes */
    // const t = timer(500);
    this.leadsService
      .fetchNextLead(
        this.selectedCampaign._id,
        this.typeDict,
        this.leadFilter,
        this.nonKeyFilters
      )
      // .pipe(takeUntil(t), takeLast(1))
      .subscribe(
        (data: any) => {
          this.loading = false;
          this.selectedLead = data.lead;
          if(isEmpty(this.selectedLead)) {
            this.isLeadEmpty = true;
          }

          if(!this.selectedLead) {
            this._snackBar.open("No leads found", 'cancel', {duration: 3000, verticalPosition: 'top'})
            return;
          }
          this.overwriteEmail.setValue(this.selectedLead?.customerEmail);
          this.selectedLead.leadStatus = null;
          this.selectedLeadHistory = data.leadHistory;
          /** Only start autodial if its there in settings */
          this.selectedLead &&
            this.selectedCampaign.autodialSettings.active &&
            this.openAutodial();
          if (!this.selectedLead) {
            this.showAppliedFiltersOnNoResult = true;
          }

          this.cleanPageState();
        },
        (error) => {
          this.loading = false;
        }
      );
  }


  cleanPageState() {
    this.prevSelectedNode && (this.prevSelectedNode.isSelected = false);
    this.followUpSelection = null;
    this.recreatePageState()
  }

  selectedLeadHistory: ILeadHistory[] = [];
  async fetchLeadById(id: string) {
    if (!this.loading) this.loading = true;
    this.leadsService.getLeadById(id).subscribe(
      async (data: { lead: ILead; leadHistory: any[] }) => {
        this.openAutodial();
        this.loading = false;
        this.selectedLead = data.lead;
        this.selectedLead.leadStatus = null;
        this.selectedLeadHistory = data.leadHistory;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  emailForm: FormGroup;
  emailTemplates: any;
  tempObj: any = {};
  emailModel;
  overwriteEmail = new FormControl('', [Validators.email])
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      content: [null],
      attachments: [null],
      overwriteEmail: this.overwriteEmail
    });
  }

  attachments: any[] = [];

  submitEmailForm(model) {}

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
    this.isVisible = false;
  }

  showFilterDrawer = false;
  leadFilter = {} as any;

  // custom filters that are not part of the lead Schema, things like freshLeads, followUps etc
  nonKeyFilters = {} as any;
  openFilterDrawer(): void {
    this.showFilterDrawer = true;
  }

  closeFilterDrawer(): void {
    this.showFilterDrawer = false;
  }

  printFilters() {}

  handleTagRemoval(tag) {
    delete this.leadFilter[tag];
    this.fetchNextLead();
  }

  isLeadEditMode = false;
  showLeadDetails() {
    this.isLeadEditMode = !this.isLeadEditMode;
  }

  reassignToUser: string;
  openReassignmentDrawer() {
    if(!this.selectedLead.leadStatus) {
      this._snackBar.open("You must select a disposition before reassigning", "cancel", { duration: 1000, verticalPosition:'top' });  
      return;
    }

    
    if(Object.values(this.actions).some(k=>k===true) && !this.selectedLead.nextAction) {
      this._snackBar.open("To reassign you must first mark a followup", "cancel", { duration: 1000, verticalPosition:'top' });
      return;
    }

    const requestedFormResult = this.checkSubmissionStatus();
    if(requestedFormResult.status === false) {
      this._snackBar.open(requestedFormResult.message, "cancel", { duration: 1000, verticalPosition:'top' });  
      return;
    }

    const rsref = this._bottomSheet.open(ReassignmentDrawerSheetComponent, {
      data: {
        usersForReassignment: this.usersForReassignment,
        selectedLead: this.selectedLead,
      },
    });

    rsref.afterDismissed().subscribe((result: { user: Pick<User, 'email'>, status: boolean}) => {
      this.reassignToUser = result.user?.email;
      if(result.status) {
        // call save and next cause this lead has been reassigned
        this.handleLeadSubmission(this.selectedLead, true)
      }
    });
  }

  closeReassignmentDrawer() {}


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

  name = "shanur";
  value = new Date();

  defaultContactValue = "mobile";
  getInputType(readableType) {
    if (readableType.type === "string") {
      return "text";
    }
    return readableType.type;
  }

  isEmail(s) {
    return isString(s) && s.indexOf("@") > 0;
  }

  doRefresh(event) {
    this.subscribeToQueryParamChange();

    setTimeout(() => {
      event.target.complete();
    }, 500);
  }


  isMobile(m) {
    console.log(m, "ismobile")
    if (!m) return false;
    const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(m);
  }

  otherData = [];
  check = false;
  evaluateOtherData() {
    let alreadyIncluded = new Set();
    this.selectedCampaign.groups.forEach((g) => {
      alreadyIncluded = new Set([...alreadyIncluded, ...g.value])
    });

    // two groups can have the same value key which might cause an issue, so replacing it with
    const allValues = this.objectkeys(this.typeDict);
    this.otherData = allValues.filter(a=>!alreadyIncluded.has(a));

    // preventing duplicate more tabs
    this.selectedCampaign.groups = this.selectedCampaign.groups.filter((g)=>{
      return g.label!=="More"
    });


    this.selectedCampaign.groups.push({
      label: "More",
      value: this.otherData,
      _id: "0",
    });

    this.leadGroups = this.selectedCampaign.groups;
  }

  uploadedDocsLink = [];
  docsUploaded = false;
  uploading = false;
  previewImg;
  async handleDocumentUpload(file: File): Promise<void> {
    this.loading = true;
    this.previewImg = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    
    try {
      const { Location } = await this.uploadService.uploadFile(
        "attachments",
        file
      );
      this.uploadedDocsLink.push(Location);
    } catch(e) {
      this._snackBar.open("Error uploading file", "cancel", { duration: 1000, verticalPosition:'top' });  
    } finally {
      this.loading = false;
    }
    
  }

  async getCameraAccessAndUpload() {
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    const image = stream.getVideoTracks()[0];

    // set this image back to a variable for preview or upload from here
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 20,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source,
    });

    this.loading = true;
    this.uploadService.getFileFromUri(image.webPath).subscribe(
      async (file) => {
        this.loading = false;
        const timestamp = new Date().getTime();
        const result: any = await this.uploadService.uploadArrayBuffer(
          file,
          `${timestamp}.${image.format}`
        );
        this.uploadedDocsLink.push(result.Location);
      },
      (error) => {this.loading = false}
    );
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
      header: "Select Image Source",
      buttons,
    });
    await actionSheet.present();
  }
}

interface ICountdown {
  action: string;
  left: number;
  status: number;
  text: string;
}
@Component({
  selector: "lead-countdown-dialog",
  templateUrl: "./lead-countdown-dialog.html",
})
export class LeadAutodial implements OnInit {
  @ViewChild("cd", { static: false }) private countdown: CountdownComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Pick<ICampaign, "autodialSettings">,
    public dialogRef: MatDialogRef<LeadAutodial>,
    private router: Router
  ) {}

  ngOnInit() {}

  navigateToCampaignList() {
    this.dialogRef.close();
    this.router.navigate(["home", "campaign", "list"]);
  }

  handleCountdown(e: ICountdown) {
    if (e.action === "done") {
      this.dialogRef.close({ event: EAutodial.callNumber, data: {} });
    }
  }
}
