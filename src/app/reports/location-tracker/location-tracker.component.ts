import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AgentService } from 'src/app/agent.service';
import { CampaignService } from 'src/app/home/campaign.service';
import { UsersService } from 'src/app/home/users.service';

@Component({
  selector: 'app-location-tracker',
  templateUrl: './location-tracker.component.html',
  styleUrls: ['./location-tracker.component.scss'],
})
export class LocationTrackerComponent implements OnInit {

  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  center = {lat: 24, lng: 12};
  markerPositions: {userId: string, lat: number, lng: number} [] = [];
  zoom = 14;
  display?: google.maps.LatLngLiteral;
  vertices: google.maps.LatLngLiteral[] = [];
  
  constructor(
    private agentService: AgentService,
    private fb: FormBuilder,
    private userService: UsersService,
    private campaignService: CampaignService
  ) { }

  data: any;
  listOfUsers: any;
  listOfCampaigns: any;

  ngOnInit() {
    this.initFilters();
    this.initCampaignList();
    this.initHandlerList();
    this.data = {
      // 28.4531706,77.0006817
      coordinates: [{lat: 28.4531706, lng: 77.0006817}]
    }
    this.initMap();
  }

  initMap() {
    this.center = this.data.coordinates[0];
    // console.log(this.data.coordinates);
    this.vertices = this.data.coordinates;
    this.markerPositions = this.data.coordinates;
  }

  filterForm: FormGroup;
  handlerFilter = new FormControl();
  startDate = new FormControl();
  endDate = new FormControl();
  // prospectName = new FormControl();
  userIds = new FormControl([]);
  campaign = new FormControl()

  initFilters() {
    this.filterForm = this.fb.group({
      startDate: this.startDate,
      endDate: this.endDate,
      // prospectName: this.prospectName,
      userIds: this.userIds,
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
      this.listOfUsers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfUsers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }
  
  // addMarker(event: google.maps.MouseEvent) {
  // }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";


  infoWindowContent = '';
  openInfoWindow(marker: MapMarker, userId: string) {
    this.infoWindowContent = userId;
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }

  getVisitTrack() {
    console.log(this.filterForm.value);

    this.agentService.getVisitTrack(this.filterForm.value).subscribe((data: IVisitTrack[])=>{
      data.forEach(d=>{
        d.locations.forEach(l=>{
          this.markerPositions.push({lat: l.lat, lng: l.lng, userId: d.userId});
        })
      });

      console.log(this.markerPositions)
    }, error=>{
      console.log(error);
    })
  }
}


interface ICoordinates {
  _id: string, 
  lat: number, 
  lng: number
}
interface IVisitTrack {
  createdAt: string,
  locations: ICoordinates[],
  updatedAt: string,
  userId: string,
  __v: number
  _id: number
}