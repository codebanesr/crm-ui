import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { AgentService } from 'src/app/agent.service';
import { CampaignService } from '../campaign.service';
import { distinctUntilChanged, debounceTime, map, catchError } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadListComponent } from 'ng-zorro-antd/upload';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzDropdownMenuComponent, NzContextMenuService } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  campaignForm: FormGroup;
  campaignConfigForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private nzContextMenuService: NzContextMenuService
  ) {}

  inputValue?: string;
  options: string[] = [];
  recentUploads: string[] = [];
  hint: string|undefined;
  type: string;

  tabSelected: string = "Lead Generation"
  configFiles: NzUploadListComponent[] = [];
  ngOnInit(){
    this.configFiles = [];
    this.initCampaignForm();
    this.initCampaignConfigForm();
    this.initEmailForm();
    this.agentService.listAgentActions(0, "campaignSchema").subscribe((list: any)=>{
      this.recentUploads = list;
    }, error=>{
      console.log(error);
    });
    this.campaignForm.get('type').valueChanges.subscribe(data=>console.log(data));

    this.suggestCampaignNames();
  }


  initCampaignConfigForm() {
    this.campaignConfigForm = this.fb.group({
      name: new FormControl(null, [Validators.required])
    });
  }

  suggestCampaignNames(hint = undefined) {
    this.campaignService.getAllCampaignTypes(hint).subscribe((campaignOpts: any[])=>{
      this.options = campaignOpts;
    }, error=>{
      console.log(error);
    })
  }

  initCampaignForm() {
    this.campaignForm = this.fb.group({
      campaignName: ['', [Validators.required]],
      comment: [''],
      type: ['Lead Generation'],
      interval: [[]],
    });



    this.campaignForm.get("campaignName").valueChanges
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(hint => {
      this.hint = hint
      this.suggestCampaignNames(hint);
    });
  }


  submitForm(value: { userName: string; email: string; password: string; confirm: string; comment: string }): void {
    for (const key in this.campaignForm.controls) {
      this.campaignForm.controls[key].markAsDirty();
      this.campaignForm.controls[key].updateValueAndValidity();
    }
    console.log(value);

    if (this.campaignForm.valid) {
      this.handleLeadFilesUpload();
    }
  }

  submitCcForm(somedata) {
    if(this.campaignConfigForm.valid) {
      this.handleCcFileUpload();
    }
  }

  submitEmailForm() {
    this.campaignService.handleEmailTemplateUpload({...this.emailForm.value, attachments: this.attachments}).subscribe((success: any)=>{
      this.msg.success(success);
    }, error=>{
      this.msg.error(error.message);
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.campaignForm.reset();
    for (const key in this.campaignForm.controls) {
      this.campaignForm.controls[key].markAsPristine();
      this.campaignForm.controls[key].updateValueAndValidity();
    }
  }



  visible = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }



  handleClick(upload) {
    this.agentService.downloadExcelFile(upload.filePath);
  }

  emailForm: FormGroup;
  initEmailForm() {
    this.emailForm = this.fb.group({
      campaign: [null],
      subject: [null],
      content: [null]
    });

    this.fillCampaignOpts();
  }

  isEmailTplVisible = false;
  showEmailTplModal() {
    this.isEmailTplVisible = true
  }
  handleEmailTplCancel() {
    this.isEmailTplVisible = false;
  }

  handleEmailTplOk() {
    // handle submit events here
  }

  uploading = false;
  fileList: NzUploadListComponent[] = [];


  beforeUpload = (file: NzUploadListComponent): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  leadFileList: NzUploadListComponent[] = [];
  beforeLeadFilesUpload = (file: NzUploadListComponent): boolean => {
    this.leadFileList = this.leadFileList.concat(file);
    return false;
  }

  beforeCcUpload = (file: NzUploadListComponent):boolean => {
    this.configFiles = this.configFiles.concat(file);
    return false;
  }

  handleLeadFilesUpload() {
    const formData = new FormData();
    this.leadFileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    formData.append("campaignInfo", JSON.stringify(this.campaignForm.value));
    // You can use any AJAX library you like
    this.campaignService.handleMultipleLeadFileUpload(formData)
      .subscribe((response: any) => {
          this.uploading = false;
          this.leadFileList = [];
          this.msg.success('Lead Files uploaded successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('Lead files could not be uploaded.');
        }
      );
  }

  attachments: any;
  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any) => {
      formData.append('files[]', file);
    });
    this.uploading = true;
    // You can use any AJAX library you like
    this.campaignService.handleFilesUpload(formData)
      .subscribe((response: any) => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('Attachments uploaded successfully.');
          this.attachments = response.body?.files;
          this.submitEmailForm();
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
  }


  handleCcFileUpload() {
    const formData = new FormData();
    formData.append("file", this.configFiles[0] as any);
    formData.append("campaignConfigInfo", JSON.stringify(this.campaignConfigForm.value));


    this.campaignService.uploadCampaignFile(formData).subscribe(result=>{
      console.log(result);
    }, error=>{
      console.log(error);
    })
  }

  demoDispositionNodes = [
    {
      title: 'parent 1',
      key: '100',
      expanded: true,
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          expanded: true,
          children: [
            { title: 'leaf', key: '10010', isLeaf: true },
            { title: 'leaf', key: '10011', isLeaf: true },
            { title: 'leaf', key: '10012', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf', key: '10020', isLeaf: true }]
        },
        {
          title: 'parent 1-2',
          key: '1003',
          children: [
            { title: 'leaf', key: '10030', isLeaf: true },
            { title: 'leaf', key: '10031', isLeaf: true }
          ]
        }
      ]
    }
  ];
  isDispositionVisible = false;
  showDispositionTplModal() {
    this.isDispositionVisible = true
  }
  handleDispositionCancel() {
    this.isDispositionVisible = false;
  }

  handleDispositionOk() {
    // handle submit events here
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
    console.log($event);
  }


  campaignOptions: any = [];
  fillCampaignOpts() {
    this.emailForm.get('campaign')
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(hint=>{
        this.campaignService.getAllCampaignTypes(hint).subscribe(options => {
          this.campaignOptions = options
          console.log(this.campaignOptions);
        });
      });
  }


  handleFormTypeChange(event) {
    console.log(event, this.tabSelected);
  }
}
