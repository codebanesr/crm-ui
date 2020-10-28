import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzFormatEmitEvent } from "ng-zorro-antd/tree";
import { NzUploadListComponent } from "ng-zorro-antd/upload";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { AgentService } from "../agent.service";
import { CampaignService } from "../home/campaign.service";
import { UsersService } from "../home/users.service";
import { PubsubService } from "../pubsub.service";

@Component({
  selector: "app-campaign-create",
  templateUrl: "./campaign-create.component.html",
  styleUrls: ["./campaign-create.component.scss"],
})
export class CampaignCreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private nzContextMenuService: NzContextMenuService,
    private activatedRouter: ActivatedRoute,
    private pubsub: PubsubService,
    private usersService: UsersService
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

  tabSelected: string = "Lead Generation";
  configFiles: NzUploadListComponent[] = [];

  visible = false;

  emailForm: FormGroup;

  isEmailTplVisible = false;

  uploading = false;
  fileList: NzUploadListComponent[] = [];

  attachments: any;
  demoDispositionNodes: any[] = [];

  campaignOptions: any = [];
  ngOnInit() {
    this.pubsub.$pub("HEADING", { heading: "Leads" });
    this.initCampaignForm();
    this.subscribeToQueryParamChange();

    this.initEmailForm();

    // this should be replaced
    this.initDispositionCore("core");
    this.agentService.listAgentActions(0, "campaignSchema").subscribe(
      (list: any) => {
        this.recentUploads = list;
      },
      (error) => {
        console.log(error);
      }
    );
    this.campaignForm
      .get("type")
      .valueChanges.subscribe((data) => console.log(data));

    this.suggestCampaignNames();
    this.initUsersList();
  }

  campaignId: string;
  submitText: string = "+ Create";
  subscribeToQueryParamChange() {
    const { id } = this.activatedRouter.snapshot.queryParams;
    if (!id) {
      return;
    }

    this.submitText = "Update";
    this.campaignId = id;
    this.campaignService.getCampaignById(id).subscribe(
      (campaign: any) => {
        this.initDispositionCore(campaign._id);
        this.patchCampainValues(campaign);
      },
      (error) => {
        this.msg.error("Failed to fetch data for ticket id ", id);
      }
    );
  }

  patchCampainValues(campaign: any) {
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
        this.demoDispositionNodes = data.options;
      },
      (error) => {
        console.log("Error while calling initDispositionCore", error.message);
      }
    );
  }

  suggestCampaignNames(hint = undefined) {
    this.campaignService.getAllCampaignTypes(hint).subscribe(
      (campaignOpts: any[]) => {
        this.options = campaignOpts;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  initCampaignForm() {
    this.campaignForm = this.fb.group({
      campaignName: ["", [Validators.required]],
      comment: [""],
      type: ["Lead Generation"],
      assignees: [[]],
      interval: [[], [Validators.required]],
    });

    this.campaignForm
      .get("campaignName")
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((hint) => {
        this.hint = hint;
        this.suggestCampaignNames(hint);
      });
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
    console.log("activeContext", ev);
  }

  addLeafNode() {
    this.activeContext.node.addChildren([
      {
        title: "New Leaf",
        key: this.campaignService.getUniqueKey(),
        isLeaf: true,
      },
    ]);
  }

  addParentNode() {
    this.activeContext.node.addChildren([
      {
        title: "New Parent",
        key: this.campaignService.getUniqueKey(),
        isLeaf: false,
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
    this.agentService.downloadExcelFile(upload.filePath);
  }
  initEmailForm() {
    this.emailForm = this.fb.group({
      campaign: [null],
      subject: [null],
      content: [null],
    });

    this.fillCampaignOpts();
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

  handleCampaignConfigFileUpload() {
    const formData = new FormData();
    this.uploading = true;

    console.log(this.campaignFiles);
    formData.append("campaignFile", this.campaignFiles[0]);
    formData.append("campaignInfo", JSON.stringify(this.campaignForm.value));
    formData.append(
      "dispositionData",
      JSON.stringify(this.demoDispositionNodes)
    );
    // You can use any AJAX library you like
    this.campaignService.createCampaignAndDisposition(formData).subscribe(
      (response: any) => {
        this.uploading = false;
        this.msg.success("Lead Files uploaded successfully.");
      },
      () => {
        this.uploading = false;
        this.msg.error("Lead files could not be uploaded.");
      }
    );
  }

  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append("files[]", file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    this.campaignService.handleFilesUpload(formData).subscribe(
      (response: any) => {
        this.uploading = false;
        this.fileList = [];
        this.msg.success("Attachments uploaded successfully.");
        this.attachments = response.body;
        this.submitEmailForm();
      },
      () => {
        this.uploading = false;
        this.msg.error("upload failed.");
      }
    );
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
    console.log(event);
    event.node.isExpanded = !event.node.isExpanded;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
    console.log($event);
  }

  fillCampaignOpts() {
    this.emailForm
      .get("campaign")
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((hint) => {
        this.campaignService.getAllCampaignTypes(hint).subscribe((options) => {
          this.campaignOptions = options;
          console.log(this.campaignOptions);
        });
      });
  }

  handleFormTypeChange(event) {
    console.log(event, this.tabSelected);
  }

  rename() {
    if (this.renameText) {
      this.activeContext.node.title = this.renameText;
      this.renameText = "";
    }
  }

  usersCount = 0;
  listOfUser: any[] = [];
  initUsersList() {
    this.usersService.getAllUsersHack().subscribe(
      (data: any) => {
        this.listOfUser = data[0].users;
        this.usersCount = data[0]?.metadata?.total;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  isNotSelected(value: string): boolean {
    // return this.listOfSelectedValue.indexOf(value) === -1;
    return this.campaignForm.get("assignees").value.indexOf(value) === -1;
  }
}
