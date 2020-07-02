import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, FormArray } from '@angular/forms';
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
  validateForm: FormGroup;
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
  ngOnInit(){
    this.initForm();
    this.agentService.listAgentActions(0, "campaignSchema").subscribe((list: any)=>{
      this.recentUploads = list;
    }, error=>{
      console.log(error);
    });
    this.validateForm.get('type').valueChanges.subscribe(data=>console.log(data));

    this.suggestCampaignNames();
  }


  suggestCampaignNames(hint = undefined) {
    this.campaignService.getAllCampaignTypes(hint).subscribe((campaignOpts: any[])=>{
      this.options = campaignOpts;
    }, error=>{
      console.log(error);
    })
  }

  initForm() {
    this.validateForm = this.fb.group({
      campaignName: ['', [Validators.required]],
      comment: [''],
      type: ['Lead Generation'],
      interval: [[]],
    });



    this.validateForm.get("campaignName").valueChanges
    .pipe(debounceTime(500), distinctUntilChanged())
    .subscribe(hint => {
      this.hint = hint
      this.suggestCampaignNames(hint);
    });
  }


  submitForm(value: { userName: string; email: string; password: string; confirm: string; comment: string }): void {
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    console.log(value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
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
  emailModel;
  initEmailForm() {
    this.emailForm = this.fb.group({
      subject: [null],
      text: [null]
    });
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


  uploadedFilesMetadata: any;
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
          this.msg.success('upload successfully.');
          this.uploadedFilesMetadata = response.body?.files;
        },
        () => {
          this.uploading = false;
          this.msg.error('upload failed.');
        }
      );
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

}
