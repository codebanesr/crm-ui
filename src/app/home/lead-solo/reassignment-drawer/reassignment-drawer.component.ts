import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ILead } from '../../interfaces/leads.interface';
import { LeadsService } from '../../leads.service';

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
    public data: {
      usersForReassignment: any[], selectedLead: ILead
    }  
  ) {}

  ngOnInit() { 
    console.log(this.data.usersForReassignment);
  }


  assignTo(user) {
    // this.loading = true;
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
}
