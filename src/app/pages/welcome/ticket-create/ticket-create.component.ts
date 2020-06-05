import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TicketsService } from 'src/app/tickets.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    this.initForm();
    this.subscribeToQueryParamChange();

    this.subscribeToLeadIdChange();
  }


  subscribeToQueryParamChange(){
    const {id} = this.activatedRouter.snapshot.queryParams;
    if(!id) return;

    this.ticketId = id;
    this.ticketService.getTicketById(id).subscribe((ticket:any)=>{
      this.patchTicketToLead(ticket);
    }, error=>{
      this.msg.error("Failed to fetch data for ticket id ", id);
    })
  }


  patchTicketToLead(ticket) {
    console.log("patch called")
    this.validateForm.patchValue({

    });
  }

  initForm() {
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
  }


  subscribeToLeadIdChange() {
    this.validateForm.get('leadId').valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(change=>{
        console.log(change);
        this.ticketService.suggestLead(change).subscribe((suggestedLeads: any[])=>{
          this.options = suggestedLeads.map(lead=>lead._id)
        })
      })
  }

  fetchSelectedLead(event) {
    this.ticketService.getTicketByLeadId(event.nzValue).subscribe((lead: any)=>{
      this.validateForm.patchValue({
        email: lead.email,
        nickname: lead.nickname,
        phoneNumberPrefix: lead.phoneNumberPrefix,
        phoneNumber: lead.phoneNumber
      })
    });
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
