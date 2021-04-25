import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICampaign } from '../campaign/campaign.interface';
import { CampaignService } from '../home/campaign.service';
import { CampaignConfigEntry, IConfig } from '../home/interfaces/global.interfaces';
import { LeadsService } from '../home/leads.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
})
export class MappingComponent implements OnInit {

  constructor(
    private leadService: LeadsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public campaignObj: {campaign: ICampaign},
    private campaignService: CampaignService
  ) { }


  elementTypes = [
    {label: "Text", value: "string"},
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


  onRemoveConfig(deleteConfig: IConfig) {
    const result = prompt(`Enter <${deleteConfig?.readableField}> to permanently delete it from campaign`);
    if(result === deleteConfig.readableField) {
      this.campaignService.removeConfig(deleteConfig).subscribe(result => {
        this.configs = this.configs.filter(
          (c) => c.internalField !== deleteConfig.internalField
        );
      }, error=>{
        console.log(error);
      });
    } else {
      alert("The text you entered is incorrect, try again!");
    }
  }

  async getLeadMapping() {
    /** @Todo second parameter accepts fields that should not be returned in the response */
    const result = await this.leadService.getLeadMappings(this.campaignObj.campaign._id, []);
    this.configs = result.mSchema.paths;
    console.log(this.configs)
  }

  configLabel: string;
  configValue: string;
  configType: string;
  openDialog(): void {
    const dialogRef = this.dialog.open(AddConfigComponent, {
      width: "250px",
      data: {
        configLabel: this.configLabel,
        configValue: this.configValue,
        elementTypes: this.elementTypes,
        configType: this.configType,
      },
    });

    dialogRef.afterClosed().subscribe((result: CampaignConfigEntry) => {
      this.handleConfigChange({
        readableField: result.configLabel,
        internalField: result.configValue,
        type: result.configType,
        isDirty: true
      });
    });
  }

  
  handleConfigChange(e) {
    if(!e.isDirty) {
      return;
    }

    this.campaignService
      .updateConfigs(
        e,
        this.campaignObj.campaign._id,
        this.campaignObj.campaign.campaignName
      )
      .subscribe(
        (data: IConfig) => {
          this.configs.push(data);
        },
        (error) => {
          this.configs = this.configs.filter((c) => {
            return c.internalField !== e.internalField;
          });
          console.log(error);
        }
      );
  }

  closeModal() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'add-config',
  templateUrl: 'add-config.component.html',
})
export class AddConfigComponent {

  constructor(
    public dialogRef: MatDialogRef<AddConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CampaignConfigEntry
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

