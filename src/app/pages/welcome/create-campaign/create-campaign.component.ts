import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { AgentService } from 'src/app/agent.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private agentService: AgentService
  ) {}

  inputValue?: string;
  options: string[] = [];
  recentUploads: string[] = [];
  ngOnInit(){
    this.initForm();
    this.agentService.listAgentActions(0, "campaignSchema").subscribe((list: any)=>{
      this.recentUploads = list;
    }, error=>{
      console.log(error);
    });
  }

  initForm() {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      comment: ['', [Validators.required]],
      type: ['Lead Generation', [Validators.required]],
      interval: [[]],
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

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
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
}
