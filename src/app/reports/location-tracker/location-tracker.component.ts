import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AgentService } from 'src/app/agent.service';
import { CampaignService } from 'src/app/home/campaign.service';
import { UsersService } from 'src/app/home/users.service';

@Component({
  selector: 'app-location-tracker',
  templateUrl: './location-tracker.component.html',
  styleUrls: ['./location-tracker.component.scss'],
})
export class LocationTrackerComponent implements OnInit {

  constructor(
    private agentService: AgentService,
    private fb: FormBuilder,
    private userService: UsersService,
    private campaignService: CampaignService
  ) { }

  listOfHandlers: any;
  listOfCampaigns: any;
  ngOnInit() {
    this.initFilters();
    this.initCampaignList();
    this.initHandlerList();
    this.agentService.getVisitTrack([]).subscribe(data => {
      console.log(data);
    })
  }

  transactionForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  prospectName = new FormControl();
  handler = new FormControl([]);
  campaign = new FormControl()

  initFilters() {
    this.transactionForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      prospectName: this.prospectName,
      handler: this.handler,
      campaign: this.campaign
    })
  }

  initCampaignList() {
    this.campaignService.getCampaigns(1, 20, {}, '', '').subscribe((result: any) =>{
      this.listOfCampaigns = result.data;
    })
  }

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
  

  getVisitTrack() {

  }
}
