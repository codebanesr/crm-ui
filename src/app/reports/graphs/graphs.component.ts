import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { CampaignService } from 'src/app/home/campaign.service';
import { UsersService } from 'src/app/home/users.service';
import { GraphService } from './graphs.service';


interface IGraphDataRes {
  pieData: { type: string; value: number; }[],
  barData: { type: string; value: number; percent: number; }[],
  stackData: {
    [x: string]: string | number;
    type: string;
  }[]
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit {

  constructor(
    private graphService: GraphService,
    private menu: MenuController,
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UsersService
  ) { }

  userList: string[] = [];
  filterForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl()
  listOfCampaigns: any;
  
  ngOnInit() {
    this.initFilters();
    this.getGraphData({});
    this.initCampaignList();
    this.initHandlerList();
  }

  initCampaignList() {
    this.campaignService.getCampaigns(1, 20, {}, '', '').subscribe((result: any) =>{
      this.listOfCampaigns = result.data;
    })
  }


  openFilter() {
    this.menu.enable(true, 'transactionFilter')
    this.menu.open('transactionFilter');
  }

  initFilters() {
    this.filterForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign
    })
  }


  getGraphData(options) {
    console.log(options);
    this.graphService.getGraphData(this.filterForm.value).subscribe((data: IGraphDataRes)=>{
      this.barData = data.barData;
      this.pieData = data.pieData;
      this.stackBarData = data.stackData;
    }, error=>{
      console.log(error);
    });
  }
  
  listOfHandlers: any;
  tempUserList: any;
  initHandlerList() {
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

  barData = [
    { type: "shanur", value: 654, percent: 0.02 },
    { type: "manish", value: 654, percent: 0.02 },
    { type: "manny", value: 4400, percent: 0.2 },
    { type: "hala", value: 5300, percent: 0.24 },
    { type: "sada", value: 6200, percent: 0.28 },
    { type: "shaiq", value: 3300, percent: 0.14 },
    { type: "renu", value: 1500, percent: 0.06 },
  ];


  stackBarTimeFrameLabel = 'month';
  stackBarQuantityLabel = 'NOC';
  stackBarData = [
    { [this.stackBarTimeFrameLabel]: 'January', type: 'Sales', [this.stackBarQuantityLabel]: 1000 },
    { [this.stackBarTimeFrameLabel]: 'September', type: 'Sales', [this.stackBarQuantityLabel]: 1170 },
    { [this.stackBarTimeFrameLabel]: 'March', type: 'Sales', [this.stackBarQuantityLabel]: 660 },
    { [this.stackBarTimeFrameLabel]: 'April', type: 'Sales', [this.stackBarQuantityLabel]: 1030 },
    { [this.stackBarTimeFrameLabel]: 'May', type: 'Expenses', [this.stackBarQuantityLabel]: 400 },
    { [this.stackBarTimeFrameLabel]: 'June', type: 'Expenses', [this.stackBarQuantityLabel]: 460 },
    { [this.stackBarTimeFrameLabel]: 'July', type: 'Expenses', [this.stackBarQuantityLabel]: 1120 },
    { [this.stackBarTimeFrameLabel]: 'January', type: 'Expenses', [this.stackBarQuantityLabel]: 540 },
    { [this.stackBarTimeFrameLabel]: 'September', type: 'Profit', [this.stackBarQuantityLabel]: 300 },
    { [this.stackBarTimeFrameLabel]: 'October', type: 'Profit', [this.stackBarQuantityLabel]: 300 },
    { [this.stackBarTimeFrameLabel]: 'April', type: 'Profit', [this.stackBarQuantityLabel]: 300 },
    { [this.stackBarTimeFrameLabel]: 'June', type: 'Profit', [this.stackBarQuantityLabel]: 350 },
  ];


  pieData = [
    { type: "Connected", value: 0.19 },
    { type: "Not Connected", value: 0.21 },
    { type: "Interested", value: 0.27 },
    { type: "Not Interested", value: 0.33 },
  ];


  downloadGraph() {

  }
}
