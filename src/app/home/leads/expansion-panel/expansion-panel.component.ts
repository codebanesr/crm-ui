import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";
import { ICampaign } from "../../../campaign/campaign.interface";
import { ITypeDict } from "../../interfaces/global.interfaces";
import { ILead } from "../../interfaces/leads.interface";
import { Plugins } from "@capacitor/core";
import { List } from "immutable";
const { Share } = Plugins;
import { Gesture, GestureController } from "@ionic/angular";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { ReassignmentDrawerSheetComponent } from "../../lead-solo/reassignment-drawer/reassignment-drawer.component";
import { UsersService } from "../../users.service";
import { LeadsService } from "../../leads.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-expansion-panel",
  templateUrl: "./expansion-panel.component.html",
  styleUrls: ["./expansion-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router, 
    private _bottomSheet: MatBottomSheet,
    private userService: UsersService,
    private leadService: LeadsService,
    public dialog: MatDialog
  ) {}

  longPressed = false;
  @Input() typeDict: ITypeDict;
  @Input() leads: List<ILead>;
  @Input() selectedCampaign: ICampaign;
  @Input() campaignList: ICampaign[]
  @ViewChildren('panels', { read: ElementRef }) panels: QueryList<ElementRef>;
  @Output() onReload: EventEmitter<boolean> = new EventEmitter();
  ngOnInit() {
    this.fetchUsersForReassignment();
  }

  ngAfterViewInit() {}

  onLongPress(ev) {
    console.log(ev)
    this.longPressed = true;
  }

  allSelected = false;
  onSelectAll() {
    this.allSelected = !this.allSelected;
    this.leads.forEach((l: any)=>{
      l.selected = this.allSelected;
    })
  }

  onDeselectAll() {
    this.longPressed = false;
  }


  leadKeys = [];
  ngOnChanges() {
    if (this.typeDict && this.selectedCampaign && this.leads) {
      this.leadKeys = Object.keys(this.typeDict);
    }
  }

  trackLead(index, lead) {
    return lead._id;
  }

  trackKeys(index, key) {
    return key;
  }

  handleLeadEdit(lead) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        isBrowsed: true,
        campaignId: this.selectedCampaign._id,
        leadId: lead._id,
      },
    });
  }

  async onSocialShareClick(event, data) {
    await Share.share({
      title: "See cool stuff",
      text: "Really awesome stuff ",
      url: "https://thefosstech.com",
      dialogTitle: "Share with buddies",
    });
  }

  usersForReassignment = [];
  fetchUsersForReassignment() {
    this.userService.getAllUsersHack().subscribe((result: any) => {
      this.usersForReassignment = result[0].users;
    });
  }


  getSelectedLeadIds() {
    return this.leads.filter((l: ILead & {selected: boolean}) => l.selected).map(l=>l._id);
  }
  
  openReassignmentDrawer() {
    const leadIds = this.getSelectedLeadIds();
    const rsref = this._bottomSheet.open(ReassignmentDrawerSheetComponent, {
      data: {
        usersForReassignment: this.usersForReassignment,
        leadIds,
        isBulkReassignment: true
      }
    });

    rsref.afterDismissed().subscribe(
      (status: boolean) => {
        this.onReload.emit(true);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleLeadArchive(lead) {
    this.leadService.archiveLead(lead._id).subscribe(data=> { 
      this.onReload.emit(true);
    }, error=> {
      console.log(error);
    })
  }


  openClosedLeads() {
    const leadIds = this.getSelectedLeadIds().toArray();
    return this.leadService.openClosedLead(leadIds).subscribe(data=> {
      this.onReload.emit(true);
    }, error=> {
      console.log(error)
    })
  }

  archiveSelected() {
    const selectedLeadIds = this.getSelectedLeadIds();
    this.leadService.archiveLeads(selectedLeadIds.toArray()).subscribe(data => {
      this.onReload.emit(true);
    }, error=>{
      console.log(error)
    });
  }

  unArchiveSelected() {
    const selectedLeadIds = this.getSelectedLeadIds();
    this.leadService.unarchiveLeads(selectedLeadIds.toArray()).subscribe(data => {
      this.onReload.emit(true);
    }, error=>{
      console.log(error)
    });
  }


  openTransferDialog() {
    const leadIds = this.getSelectedLeadIds();
    this.dialog.open(LeadTransferDialog, {
      data: {
        campaigns: this.campaignList,
        leadIds: leadIds.toArray()
      }
    });
  }
}



interface ITransferDialogData {
  leadIds: string[],
  campaigns: ICampaign[]
}

@Component({
  selector: 'lead-transfer-dialog',
  templateUrl: 'lead-transfer-dialog.html',
})
export class LeadTransferDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITransferDialogData,
    private leadService: LeadsService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<LeadTransferDialog>,
  ) {}

  toCampaignId: string
  transferLeads() {
    const {leadIds} = this.data;
    console.log({leadIds})
    if(!leadIds) {
      return;
    }
    console.log(this.toCampaignId);
    this.leadService.transferLeads(leadIds, this.toCampaignId).subscribe(result=>{
      this._snackBar.open("Successfully transferred leads", 'Cancel', {duration: 3000, verticalPosition: 'top', politeness: 'polite'})
    }, error=> {
      this._snackBar.open("Failed to transfer leads", 'Cancel', {duration: 3000, verticalPosition: 'top', politeness: 'assertive'})
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

