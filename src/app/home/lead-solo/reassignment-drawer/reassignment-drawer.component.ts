import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { List } from 'immutable';
import { ILead } from '../../interfaces/leads.interface';
import { User } from '../../interfaces/user';
import { LeadsService } from '../../leads.service';


interface ReassignmentDrawerInput { 
  usersForReassignment: any[], 
  selectedLead?: ILead,
  isBulkReassignment?: boolean;
  leadIds?: typeof List | string[]
}  

@Component({
  selector: 'app-reassignment-drawer',
  templateUrl: './reassignment-drawer.component.html',
  styleUrls: ['./reassignment-drawer.component.scss'],
})
export class ReassignmentDrawerSheetComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<ReassignmentDrawerSheetComponent>,
    private _snackBar: MatSnackBar,
    private leadsService: LeadsService,
    @Inject(MAT_BOTTOM_SHEET_DATA) 
    public data: ReassignmentDrawerInput
  ) {}

  ngOnInit() { 
    console.log(this.data.usersForReassignment);
  }


  assignTo(user: User) {
    if(!this.data.isBulkReassignment) {
      this.leadsService.reassignLead(this.data.selectedLead.email, user.email, this.data.selectedLead).subscribe(data=>{
        // this.loading = false;
        this._snackBar.open("Successfully reassigned lead to", user.email, {
          duration: 2000,
        });
    
        this._bottomSheetRef.dismiss(true);
  
        // close the drawer before fetching next lead
        // this.fetchNextLead();
      }, error=>{
        this._bottomSheetRef.dismiss(false);
      });
    }

    // i am aware that else if is not required
    else if(this.data.isBulkReassignment) {
      console.log("ids received", this.data.leadIds)
      this.leadsService.reassignBulkLeads(this.data.leadIds as string[], user.email).subscribe(data=>{
        console.log(data);
      }, error => {
        console.log(error);
      })
    }
  }
}
