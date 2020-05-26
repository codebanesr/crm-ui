import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TicketsService } from 'src/app/tickets.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import { isEquivalent } from 'src/helpers/isSimilar.object';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {

  validateForm!: FormGroup;
  options: string[] = [];
  ticketId: string;

  socket: SocketIOClient.Socket;
  constructor(
    private fb: FormBuilder,
    private ticketService: TicketsService,
    private msg: NzMessageService,
    private activatedRouter: ActivatedRoute
  ) { }

  client = false;
  ngOnInit(): void {
    this.initForm();
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
    this.activatedRouter.queryParams.subscribe(data => {
      this.initSocket();
      this.ticketId = data.id;
      this.ticketService.getTicketById(data.id).subscribe((data: any) => {
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
      }, error => {
        this.msg.error("Failed to fetch data for ticket id ", data.id);
      })
    })
  }

  subscribed: boolean;
  initSocket() {

    //Connection
    this.socket = io("localhost:6001?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIwMSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxMjMyMzkwMjJ9.2DplMkncA-No_qD-SZCLRf3Wlvp3srDVHaNVnO_afM8", {
      "transports": ["polling", "websocket"]
    });

    // Listeners
    this.socket.on("connect", (data) => {
      console.log("socket connected");
    });



    this.validateForm.valueChanges.subscribe(change=>{
      if(this.client) {
        this.socket.emit("PUBLISH", { subject: "testing", data: change });
      }else if(!this.subscribed){
        this.socket.emit("SUBSCRIBE", {
          "subject": "testing"
        });

        this.socket.on("message", (data) => {
          if(data.payload && !isEquivalent(data.payload, this.validateForm.value)) {
            this.validateForm.patchValue(data.payload);
          }
        });
        this.subscribed = true;
      }
    });


    this.socket.on("warn", (data) => {
      console.log(data)
    });

    this.socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
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
    if (!this.ticketId) {
      this.createTicket();
    } else {
      this.updateTicket();
    }
  }


  createTicket() {
    this.ticketService.addTicket(this.validateForm.value).subscribe(data => {
      this.msg.success("Successfully added ticket");
    }, error => {
      this.msg.error("Something went wrong while adding ticket");
    });
  }


  updateTicket() {
    this.ticketService.updateTicket(this.validateForm.value, this.ticketId).subscribe(data => {
      this.msg.success(`Successfully updated ticket with id ${this.ticketId}`);
    }, error => {
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
