import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AgentService } from 'src/app/agent.service';
import { CampaignService } from '../campaign.service';
import { distinctUntilChanged, debounceTime, map, catchError } from 'rxjs/operators';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

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
    private campaignService: CampaignService
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


  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.campaignService.uploadCampaign(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }

}
