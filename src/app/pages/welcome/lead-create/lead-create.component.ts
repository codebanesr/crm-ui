import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from 'src/app/leads.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ILeadColumn } from '../leads/lead.interface';
import { CampaignService } from '../campaign.service';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';


@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.scss']
})
export class LeadCreateComponent implements OnInit {


  validateForm!: FormGroup;
  leadOptions: string[] = [];
  ticketId: string;

  constructor(
    private fb: FormBuilder,
    private leadsService: LeadsService,
    private msg: NzMessageService,
    private activatedRouter: ActivatedRoute,
    private campaignService: CampaignService,
    private nzContextMenuService: NzContextMenuService
  ) {}


  demoDispositionNodes: any[] = []
  ngOnInit(): void {
    this.initForm();
    this.mapInternalToReadableFields();
    this.subscribeToQueryParamChange();
    this.initDispositionCore('core');
    this.subscribeToLeadIdChange();
  }

  nzEvent(event: NzFormatEmitEvent): void {
    if (event.node.isLeaf) {
      console.log("set this to formControl", event.node.origin.title);
      this.validateForm.patchValue({ leadStatus: event.node.origin.title });
    }
    event.node.isExpanded = !event.node.isExpanded;
  }

  initDispositionCore(campaignId: string) {
    this.campaignService.getDisposition(campaignId).subscribe((data: any) => {
      console.log(data);
      this.demoDispositionNodes = data.options;
    }, error => {
        console.log(error);
    })
  }

  subscribeToQueryParamChange(){
    const { id } = this.activatedRouter.snapshot.queryParams;
    if (!id) { return; }

    this.ticketId = id;
    this.leadsService.getLeadById(id).subscribe((ticket: any) => {
      this.patchTicketToLead(ticket);
    }, error => {
      this.msg.error('Failed to fetch data for ticket id ', id);
    });
  }


  patchTicketToLead(ticket) {
    console.log('patch called');
    this.validateForm.patchValue(ticket);
  }

  initForm() {
    this.validateForm = this.fb.group({
      _id: [null],
      externalId: [null, [Validators.required]],
      address: [null],
      amount: [null],
      companyName: [null],
      createdAt: [null],
      customerEmail: [null],
      email: [null],
      firstName: [null],
      followUp: [null],
      lastName: [null],
      leadStatus: [null],
      phoneNumber: [null],
      phoneNumberPrefix: ['+91'],
      product: [null],
      remarks: [null],
      source: [null],
      updatedAt: [null],
      disposition: [null]
    });
  }


  subscribeToLeadIdChange() {
    this.validateForm.get('externalId').valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(change => {
        console.log(change);
        this.leadsService.suggestLead(change).subscribe((suggestedLeads: any[]) => {
          this.leadOptions = suggestedLeads.map(lead => lead.externalId);
        });
      });
  }

  fetchSelectedLead(event) {
    this.leadsService.getLeadById(event.nzValue).subscribe((lead: any) => {
      this.validateForm.patchValue({
        _id: lead._id,
        externalId: lead.externalId,
        address: lead.address,
        amount: lead.amount,
        companyName: lead.companyName,
        createdAt: lead.createdAt,
        customerEmail: lead.customerEmail,
        email: lead.email,
        firstName: lead.firstName,
        followUp: lead.followUp,
        lastName: lead.lastName,
        leadStatus: lead.leadStatus,
        phoneNumber: lead.phoneNumber,
        phoneNumberPrefix: lead.phoneNumberPrefix,
        product: lead.product,
        remarks: lead.remarks,
        source: lead.source,
        updatedAt: lead.updatedAt,
      });
    });
  }


  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (!this.ticketId) {
      this.createTicket();
    }else{
      this.updateTicket();
    }
  }


  createTicket() {
    this.leadsService.addLead(this.validateForm.value).subscribe(data => {
      this.msg.success('Successfully added ticket');
    }, error => {
      this.msg.error('Something went wrong while adding ticket');
    });
  }



  updateTicket() {
    this.leadsService.updateLead(this.ticketId, this.validateForm.value).subscribe(data => {
      this.msg.success(`Successfully updated ticket with id ${this.ticketId}`);
    }, error => {
      this.msg.error(`Failed to update ticket with id ${this.ticketId}`);
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }


  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }


  typeDict: { [key: string]: { label: string, value: string, type: string, checked: boolean } };
  dataLoaded: boolean = false;
  showCols: any[] = [];
  mapInternalToReadableFields() {
    this.leadsService.getAllLeadColumns().subscribe((mSchema: { paths: ILeadColumn[] }) => {
      mSchema.paths.forEach((path: ILeadColumn) => {
        this.showCols.push({
          label: path.readableField,
          value: path.internalField,
          checked: path.checked,
          type: path.type
        });
      });

      console.log("Successfully created mappings");
      this.typeDict = Object.assign({}, ...this.showCols.map((x) => ({ [x.value]: x })));
    }, error => {
      console.log("Unable to create mappings")
    })
  }
}
