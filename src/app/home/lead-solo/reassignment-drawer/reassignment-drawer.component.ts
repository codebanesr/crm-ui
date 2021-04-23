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
      // if(!this.data.leadStatus) {
      //   this._snackBar.open("Please select lead status before", "cancel", { duration: 200 });
      //   this._bottomSheetRef.dismiss(false);
      //   return;
      // }
      this.leadsService.reassignLead(this.data.selectedLead.email, user.email, this.data.selectedLead).subscribe(data=>{
        
        this._snackBar.open("Successfully reassigned lead to", user.email, {
          duration: 2000,
        });
    
        this._bottomSheetRef.dismiss({user, status: true});
      }, error=>{
        this._bottomSheetRef.dismiss({user: null, status: false});
      });

      this._bottomSheetRef.dismiss({user, status: true});
    }

    // i am aware that else if is not required
    else if(this.data.isBulkReassignment) {
      console.log("ids received", this.data.leadIds)
      this.leadsService.reassignBulkLeads(this.data.leadIds as string[], user.email).subscribe(data=>{
        this._bottomSheetRef.dismiss();
        this._snackBar.open("Successfully reassigned leads", "cancel", {
          duration: 3000,
          verticalPosition: "top",
        });
      }, error => {
        console.log(error);
      })
    }
  }
}
