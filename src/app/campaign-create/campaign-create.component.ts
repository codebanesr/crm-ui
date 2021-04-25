import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { isArray } from 'lodash';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzFormatEmitEvent, NzTreeNode, NzTreeService } from "ng-zorro-antd/tree";
import { NzUploadListComponent } from "ng-zorro-antd/upload";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { field } from "src/global.model";
import { AgentService } from "../agent.service";
import { ICampaign } from "../campaign/campaign.interface";
import { CampaignService } from "../home/campaign.service";
import { IChildren, ModelInterface } from "../home/interfaces/global.interfaces";
import { LeadsService } from "../home/leads.service";
import { UsersService } from "../home/users.service";
import { MappingComponent } from "../mapping/mapping.component";
import { PubsubService } from "../pubsub.service";
import { UploadService } from "../upload.service";
import { WebsocketService } from "../websocket.service";

@Component({
  selector: "app-campaign-create",
  templateUrl: "./campaign-create.component.html",
  styleUrls: ["./campaign-create.component.scss"],
})
export class CampaignCreateComponent implements OnInit, OnDestroy {
  constructor(
    private usersService: UsersService,
    private leadsService: LeadsService,
    private fb: FormBuilder,
    private agentService: AgentService,
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private nzContextMenuService: NzContextMenuService,
    private activatedRouter: ActivatedRoute,
    private uploadService: UploadService,
    private dialogCtrl: MatDialog,
    private router: Router,
    private sock: WebsocketService,
    private _snackBar: MatSnackBar
  ) {}
  campaignForm: FormGroup;

  objectKeys = Object.keys;
  renameText: string;
  inputValue?: string;
  isDispositionVisible = false;
  options: string[] = [];
  recentUploads: string[] = [];
  hint: string | undefined;
  type: string;

  isArray = isArray;

  tabSelected: string = "Lead Generation";
  configFiles: NzUploadListComponent[] = [];

  visible = false;

  emailForm: FormGroup;

  isEmailTplVisible = false;

  uploading = false;
  fileList: NzUploadListComponent[] = [];

  attachments: any;
  demoDispositionNodes: IChildren[] = [
    {
      title: "Add Dispositions",
      key: "root",
      isLeaf: false,
      selected: false,
      children: [
        {
          title: "Interested",
          key: "interested",
          isLeaf: false,
          selected: false,
          children: [
            {
              title: "Hot",
              key: "hot",
              isLeaf: true,
              selected: false
            },
            {
              title: "warm",
              key: "warm",
              isLeaf: true,
              selected: false
            },
            {
              title: "cold",
              key: "cold",
              isLeaf: true,
              selected: false
            },
            {
              title: "won",
              key: "won",
              isLeaf: true,
              selected:false
            },
          ],
        },
        {
          title: "Not Interested",
          key: "NI",
          isLeaf: false,
          selected: false,
          children: [
            {
              title: "Too Costly",
              key: "TC",
              isLeaf: true,
              selected: false
            },
            {
              title: "Already bought",
              key: "AB",
              isLeaf: true,
              selected: false
            },
            {
              title: "Using Another CRM",
              key: "uacrm",
              isLeaf: true,
              selected: false
            },
          ],
        },
      ],
    },
  ];

  // campaignOptions: any = [];
  assignTo = [
    { label: "Manager", value: "manager", checked: false },
    { label: "Tele Callers", value: "teleCallers", checked: false },
    { label: "Field Executives", value: "fieldExecutives", checked: false },
    { label: "Past Handlers", value: "pastHandlers", checked: false },
  ];

  advancedSettings = [
    { label: "Mark Wrong Number", value: "markWrongNumber", checked: false },
    {
      label: "Add Prospect Reference",
      value: "addProspectReference",
      checked: false,
    },
  ];

  groups = [];
  assigneeFilter: FormControl;
  ngOnInit() {
    this.initAutodialForm();
    this.initCampaignForm();

    this.assigneeFilter = new FormControl();
  }

  ionViewWillEnter() {
    this.subscribeToQueryParamChange();

    this.initEmailForm();

    // this.suggestCampaignNames();
    this.initUsersList();

    this.sock.getAlerts().subscribe((text) => {
      console.log(text);
      this._snackBar.open(text, "cancel", { duration: 2000 });
    });
  }

  campaignId: string;
  campaign: ICampaign;
  submitText: string = "+ Create";
  subscribeToQueryParamChange() {
    const { id } = this.activatedRouter.snapshot.queryParams;
    if (!id) {
      return;
    }
    this.submitText = "Update Campaign Details";
    this.campaignId = id;
    this.campaignService.getCampaignById(id).subscribe(
      (campaign: ICampaign) => {
        this.initDispositionCore(campaign._id);
        this.campaign = campaign;
        this.groups = this.campaign.groups || [];

        /** This also calls the get campaigns api, jo readable field aur internal field ka mapping hai iske bina bhi hosakta hai */
        this.getAllLeadColumns();
        this.patchCompainValues(campaign);
      },
      (error) => {
        // this should be replaced
        this.msg.error("Failed to fetch data for ticket id ", id);
      }
    );
  }

  routeToRules() {
    this.router.navigate(["rules", "list-rules"], {
      queryParams: {
        campaignId: this.campaign._id,
      },
    });
  }

  autodialForm: FormGroup;
  initAutodialForm() {
    this.autodialForm = this.fb.group({
      active: new FormControl(false), //active
      mfupd: new FormControl(2), // max followup per day
      cpts: new FormControl(), //call preview time in seconds
      cdts: new FormControl(), // call disposition time in seconds
    });
  }

  getUploadedFiles() {
    this.agentService
      .listAgentActions(0, this.campaignId, "campaignSchema")
      .subscribe(
        (list: any) => {
          this.recentUploads = list;
        },
        (error) => {
          console.log(error);
        }
      );
    // this.campaignForm
    //   .get("type")
    //   .valueChanges.subscribe((data) => console.log(data));
  }

  patchCompainValues(campaign: any) {
    this.campaignForm.patchValue(campaign);
    this.campaignForm.patchValue({ assignees: campaign.assignees });
  }

  initDispositionCore(campaignId: string) {
    if (!campaignId) {
      console.warn("fetching core disposition");
      campaignId = "core";
    }

    this.campaignService.getDisposition(campaignId).subscribe(
      (data: any) => {
        this.demoDispositionNodes = [
          { title: "Root", key: "root", children: data.options, selected: false, isLeaf: false, expanded: false },
        ];
      },
      (error) => {
        console.log("Error while calling initDispositionCore", error.message);
      }
    );
  }
  // suggestCampaignNames(hint = undefined) {
  //   this.campaignService.getAllCampaignTypes(hint).subscribe(
  //     (campaignOpts: any[]) => {
  //       this.options = campaignOpts;
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  initCampaignForm() {
    this.campaignForm = this.fb.group({
      _id: [null],
      campaignName: ["", [Validators.required]],
      comment: [""],
      type: ["Lead Generation"],
      assignees: [[]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });

    // this.campaignForm
    //   .get("campaignName")
    //   .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
    //   .subscribe((hint) => {
    //     this.hint = hint;
    //     this.suggestCampaignNames(hint);
    //   });
  }

  submitForm(value: any): void {
    for (const key in this.campaignForm.controls) {
      this.campaignForm.controls[key].markAsDirty();
      this.campaignForm.controls[key].updateValueAndValidity();
    }
    console.log(value);

    if (this.campaignForm.valid) {
      this.handleCampaignConfigFileUpload();
    }
  }

  submitEmailForm() {
    this.campaignService
      .handleEmailTemplateUpload({
        ...this.emailForm.value,
        campaignId: this.campaign._id,
        attachments: this.attachments,
      })
      .subscribe(
        (success: any) => {
          this.msg.success(success);
        },
        (error) => {
          this.msg.error(error.message);
        }
      );
  }

  activeContext: NzFormatEmitEvent;
  nodeActions(ev: NzFormatEmitEvent) {
    this.activeContext = ev;
    console.log("activeContext", ev, this.demoDispositionNodes);
  }

  modelFields: Array<field> = [];
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

  onCampaignFormUpdate(event) {
    this.formModel = event;
  }

  addLeafNode(isLeaf: boolean) {
    this.activeContext.node.addChildren([
      {
        title: "<Subdisposition>",
        key: this.campaignService.getUniqueKey(),
        isLeaf,
      },
    ]);
  }

  addParentNode(isLeaf = false) {
    this.activeContext.node.addChildren([
      {
        title: "<Disposition>",
        key: this.campaignService.getUniqueKey(),
        isLeaf,
      },
    ]);
  }

  deleteNode() {
    this.activeContext.node.remove();
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  handleClick(upload) {
    if (upload.filePath.indexOf("amazonaws") > 0) {
      console.log(upload.filePath);
      window.open(upload.filePath, "_blank");
    } else {
      this.agentService.downloadExcelFile(upload.filePath);
    }
  }
  initEmailForm() {
    this.emailForm = this.fb.group({
      templateName: [null],
      subject: [null],
      content: [null],
    });

    // this.fillCampaignOpts();
  }
  showEmailTplModal() {
    this.isEmailTplVisible = true;
  }
  handleEmailTplCancel() {
    this.isEmailTplVisible = false;
  }

  handleEmailTplOk() {
    // handle submit events here
  }

  beforeUpload = (file: NzUploadListComponent): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  campaignFiles: any[] = [];
  captureCampaignConfigFile(event) {
    this.campaignFiles = event.target.files;
    console.log(this.campaignFiles);
  }

  archiveCampaign() {
    this.campaignService.archiveCampaign(this.campaign._id).subscribe(
      (data) => {
        console.log("Campaign has been archived");
      },
      (error) => {
        console.log("An error occured while archiving campaign");
      }
    );
  }


  postProcessDisposition(children: IChildren[]) {
    if(!children) {
      return;
    }

    children.forEach(child=>{
      child.selected = false;
      // this control should be available to admin itself, whatever state he saves the dispositions whi dikhna chahiye
      child.expanded = false;

      this.postProcessDisposition(child.children);
    })
  }

  handleCampaignConfigFileUpload() {
    this.postProcessDisposition(this.demoDispositionNodes[0].children);
    if (!this.formModel) {
      this.msg.error("form model is undefined");
      return;
    }

    const isNew = this.campaignId ? false : true;
    const formData = {
      isNew: isNew,
      campaignInfo: this.campaignForm.value,
      groups: this.groups,
      formModel: this.formModel,
      dispositionData: this.demoDispositionNodes[0].children,
      advancedSettings: this.advancedSettings
        .filter((el) => el.checked)
        .map((el) => el.value),
      assignTo: this.assignTo.filter((el) => el.checked).map((el) => el.value),
      uniqueCols: this.uniqueCols.filter((c) => c.checked).map((c) => c.value),
      editableCols: this.editableCols
        .filter((c) => c.checked)
        .map((c) => c.value),
      browsableCols: this.browsableCols
        .filter((c) => c.checked)
        .map((c) => c.value),
      autodialSettings: this.autodialForm.value,
    };

    if (isNew) {
      // delete id of campaign being passed as null and also prevent null value being passed to backend
      delete formData.campaignInfo._id;
      this.groups.push({
        label: "contact",
        value: ["customerEmail", "mobilePhone"],
      });
    }

    this.campaignService.createCampaignAndDisposition(formData).subscribe(
      (response: any) => {
        this.uploading = false;
        this.msg.success("Lead Files uploaded successfully.");
        this.router.navigate(["home", "campaign", "list"]);
      },
      () => {
        this.uploading = false;
        this.msg.error("Lead files could not be uploaded.");
      }
    );
  }

  leadFileList: NzUploadListComponent[] = [];
  async handleLeadFilesUpload() {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.uploading = true;
    const filePromises = this.leadFileList.map((f) => {
      return this.uploadService.uploadFile("leads", f);
    });

    const result = await Promise.all(filePromises);
    this.campaignService
      .uploadMultipleLeadFiles({
        files: result,
        campaignId: this.campaignForm.get("_id").value,
        campaignName: this.campaignForm.get("campaignName").value,
      })
      .subscribe(
        (response: any) => {
          this.uploading = false;
          this.leadFileList = [];
          this.msg.success("Lead Files uploaded successfully.");
        },
        () => {
          this.uploading = false;
          this.msg.error("Lead files could not be uploaded.");
        }
      );
    this.uploading = false;
  }

  beforeLeadFilesUpload = (file: NzUploadListComponent): boolean => {
    this.leadFileList = this.leadFileList.concat(file);
    return false;
  };

  async handleUpload(): Promise<void> {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append("files[]", file);
    });
    this.uploading = true;

    try {
      const filePromises = this.fileList.map((f) => {
        return this.uploadService.uploadFile("email-templates", f);
      });

      this.attachments = await Promise.all(filePromises);
      this.submitEmailForm();
      this.msg.success("Successfully uploaded all files");
    } catch (e) {
      console.log(e);
      this.msg.error("Unable to upload multiple files");
    }

    this.uploading = false;
  }

  showDispositionTplModal() {
    this.isDispositionVisible = true;
  }
  handleDispositionCancel() {
    this.isDispositionVisible = false;
  }

  handleDispositionOk() {
    // handle submit events here
  }

  nzEvent(event: NzFormatEmitEvent): void {
    event.node.isExpanded = !event.node.isExpanded;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
    console.log($event);
  }

  handleFormTypeChange(event) {
    console.log(event, this.tabSelected);
  }

  rename() {
    if (this.renameText) {
      this.activeContext.node.title = this.renameText;
      this.activeContext.node.origin.title = this.renameText;
      console.log(this.demoDispositionNodes);
      // this.demoDispositionNodes = [
      //   this.activeContext.node.treeService.rootNodes[0].origin,
      // ];
      this.renameText = "";
    }
  }

  selectedAction = null;
  attachAction() {
    if (this.selectedAction) {
      this.activeContext.node.origin["action"] = this.selectedAction;
    }
    this.selectedAction = null;
  }

  usersCount = 0;
  listOfUser: any[] = [];
  filteredListOfUsers = [];
  initUsersList() {
    this.usersService.getAllUsersHack().subscribe(
      (data: any) => {
        this.listOfUser = data[0].users;
        this.filteredListOfUsers = this.listOfUser;
        this.usersCount = data[0]?.metadata?.total;

        this.assigneeFilter.valueChanges.subscribe((change) => {
          this.filteredListOfUsers = this.listOfUser.filter((user) => {
            return user.fullName.indexOf(change) > -1;
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isNotSelected(value: string): boolean {
    if (!this.campaignForm.get("assignees").value) {
      return true;
    }
    return this.campaignForm.get("assignees").value?.indexOf(value) === -1;
  }

  isNotInGroup(value: string, all: string[]) {
    if (!all.includes(value)) {
      return true;
    }
    return false;
  }

  loading = false;
  editableCols: any[] = [];
  browsableCols: any[] = [];
  uniqueCols: any[] = [];
  allCols: any;
  allLeadCols: any[] = [];
  async getAllLeadColumns() {
    this.loading = true;
    this.allCols = await this.leadsService.getLeadMappings(this.campaignId);
    this.allLeadCols = this.allCols.mSchema.paths;
    this.editableCols = Object.values(
      JSON.parse(JSON.stringify(this.allCols.typeDict))
    );

    this.editableCols?.forEach((c) => {
      if (this.campaign?.editableCols?.includes(c.value)) {
        c.checked = true;
      } else {
        c.checked = false;
      }
    });

    this.browsableCols = Object.values(
      JSON.parse(JSON.stringify(this.allCols.typeDict))
    );

    this.browsableCols?.forEach((c) => {
      if (this.campaign?.browsableCols?.includes(c.value)) {
        c.checked = true;
      } else {
        c.checked = false;
      }
    });

    this.uniqueCols = Object.values(
      JSON.parse(JSON.stringify(this.allCols.typeDict))
    );

    this.uniqueCols?.forEach((c) => {
      if (this.campaign?.uniqueCols?.includes(c.value)) {
        c.checked = true;
      } else {
        c.checked = false;
      }
    });

    this.assignTo.map((el) => {
      if (this.campaign?.assignTo?.includes(el.value)) {
        el.checked = true;
      }
    });

    this.advancedSettings.map((el) => {
      if (this.campaign?.advancedSettings?.includes(el.value)) {
        el.checked = true;
      }
    });

    if (this.campaign.formModel) {
      this.formModel = this.campaign.formModel;
    }
  }

  handleGroupAdd(event) {
    this.groups.push({
      label: this.inputValue || `Others-${this.groups.length+1}`,
      value: [],
    });
  }

  deleteGroup(label: string) {
    this.groups = this.groups.filter((g) => g.label !== label);
  }

  displayParamModal() {
    const mappingRef = this.dialogCtrl.open(MappingComponent, {
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "100%",
      width: "100%",
      data: {
        campaign: this.campaign,
      },
    });


    mappingRef.afterClosed().subscribe(res=>{
      // update any changes made to editable and browsable columns by fetching the campaign again
      // whenever a config is created or deleted it will reflect in browsable and editable columns
      // in the database
      this.getAllLeadColumns();
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.subscribeToQueryParamChange();
      event.target.complete();
    }, 500);
  }

  cloneCampaign() {
    this.campaignService.cloneCampaign(this.campaign._id).subscribe(
      (data) => {
        this._snackBar
          .open("Campaign Successfully created", "Cancel", {
            duration: 3000,
            verticalPosition: "top",
          })
          .afterDismissed()
          .subscribe((d) => {
            this.router.navigate(["home", "campaign", "list"]);
          });
      },
      (error) => {
        this._snackBar.open("Failed to copy campaign", "cancel", {
          duration: 3000,
          verticalPosition: "top",
        });
      }
    );
  }

  ngOnDestroy() {
    this.sock.disconnect();
  }
}