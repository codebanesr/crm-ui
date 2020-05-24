import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TicketsService } from 'src/app/tickets.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {

  validateForm!: FormGroup;
  options: string[] = [];
  ticketId: string;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private msg: NzMessageService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      leadId: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      assignedTo: [null, [Validators.required, Validators.email]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+91'],
      phoneNumber: [null, [Validators.required]],
      review: ["positive", [Validators.required]],
      followUp: [null, [Validators.required]],
      agree: [false],
      status: ["NEW", [Validators.required]],
    });
    this.activatedRouter.queryParams.subscribe(data=>{
      this.ticketId = data.id;
      this.ticketService.getTicketById(data.id).subscribe((data:any)=>{
        this.validateForm.patchValue({
          leadId: data.leadId,
          email: data.customer.email,
          phoneNumber: data.customer.phoneNumber,
          phoneNumberPrefix: data.customer.phoneNumberPrefix,
          nickname: data.customer.name,
          assignedTo: data.assignedTo,
          review: data.review,
          followUp: data.followUp,
          agree: data.agree,
          status: data.status
        });
      }, error=>{
        this.msg.error("Failed to fetch data for ticket id ", data.id);
      })
    })
  }


  onLeadChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if(!this.ticketId) {
      this.createTicket();
    }else{
      this.updateTicket();
    }
  }


  createTicket() {
    this.ticketService.addTicket(this.validateForm.value).subscribe(data=>{
      this.msg.success("Successfully added ticket");
    }, error=>{
      this.msg.error("Something went wrong while adding ticket");
    });
  }


  updateTicket() {
    this.ticketService.updateTicket(this.validateForm.value, this.ticketId).subscribe(data=>{
      this.msg.success(`Successfully updated ticket with id ${this.ticketId}`);
    }, error=>{
      this.msg.error(`Failed to update ticket with id ${this.ticketId}`);
    })
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
