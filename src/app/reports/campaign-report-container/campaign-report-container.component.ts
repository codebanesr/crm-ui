import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICampaign } from 'src/app/campaign/campaign.interface';
import { CampaignService } from 'src/app/home/campaign.service';
import { UsersService } from 'src/app/home/users.service';
import { GraphService } from '../graphs/graphs.service';

@Component({
  selector: 'app-campaign-report-container',
  templateUrl: './campaign-report-container.component.html',
  styleUrls: ['./campaign-report-container.component.scss'],
})
export class CampaignReportContainerComponent implements AfterViewInit, OnInit {

  constructor(
    private graphService: GraphService,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService
  ) { }
  
  stackBarTitle = 'Category Wise Lead Count / Campaign';
  XAxisLabel = 'Campaign Name';
  YAxisLabel = 'Total Leads';
  stackBarData = null;
  max = 50;

  barData: any[];
  listOfCampaigns: ICampaign[] = [];

  talktimeData = null;
  averageTalktimeData = null;

  ngOnInit(){
    this.initFilterForm();
    this.initCampaignList();
    this.initHandlerList();
  }


  ngAfterViewInit() {
    this.fetchAllAnalyticsData();
  }

  fetchAllAnalyticsData() {
    this.graphService.getUserTalktime(this.filterForm.value).subscribe(talktimeData=>{
      this.talktimeData = talktimeData;

      this.averageTalktimeData = this.talktimeData.map(d=>{
        return {
          type: d.type,
          value: d.averageValue
        }
      })
    });

    this.graphService.campaignWiseLeadCount(this.filterForm.value).subscribe(data=>{
      this.barData = data;
    });


    this.graphService.campaignWiseLeadCountPerCategory(this.filterForm.value).subscribe(data=>{
      this.XAxisLabel = data.XAxisLabel;
      this.YAxisLabel = data.YAxisLabel;

      this.max = data.max;
      this.stackBarData = data.stackBarData;
    })
  }

  initCampaignList() {
    this.campaignService.getCampaigns(1, 20, {}, '', '').subscribe((result: any) =>{
      this.listOfCampaigns = result.data;
    })
  }

  listOfHandlers: any;
  tempUserList: any;
  async initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any)=>{
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }



  filterForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl();
  leadId = new FormControl(null);
  initFilterForm() {
    this.filterForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign,
      leadId: this.leadId
    })
  }
}
