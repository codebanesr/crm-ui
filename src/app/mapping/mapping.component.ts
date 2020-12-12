import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadsService } from '../home/leads.service';
import { SignupComponent } from '../signup/signup.component';

interface IConfig {
  checked?: boolean;
  internalField: string;
  name?: string;
  organization?: string;
  readableField: string;
  type: string;
  _id?: string;
}


@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
})
export class MappingComponent implements OnInit {

  constructor(
    private leadService: LeadsService,
    public dialog: MatDialog
  ) { }

  elementTypes = [
    {label: "String", value: "string"},
    {label: "Date", value: "date"},
    {label: "Select", value: "select"},
    {label: "Mobile", value: "tel"},
    {label: "Geolocation", value: "geo"},
    {label: "Number", value: "number"}
  ];
  configs: IConfig[] = [];
  ngOnInit() {
    this.getLeadMapping();
  }


  async getLeadMapping() {
    /** @Todo */
    const result = await this.leadService.getLeadMappings("5f89dd4c3d90afc740368088");
    this.configs = result.mSchema.paths;
    console.log(this.configs)
  }

  configLabel: string;
  configValue: string;
  configType: string;
  openDialog(): void {
    const dialogRef = this.dialog.open(AddConfigComponent, {
      width: '250px',
      data: {configLabel: this.configLabel, configValue: this.configValue, elementTypes: this.elementTypes, configType: this.configType}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.configs.push({readableField: result.configLabel, internalField: result.configLabel, type: result.configType})
    });
  }
}


export interface DialogData {
  configLabel: string, configValue: string, elementTypes: any[], configType: string
}


@Component({
  selector: 'add-config',
  templateUrl: 'add-config.component.html',
})
export class AddConfigComponent {

  constructor(
    public dialogRef: MatDialogRef<AddConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

