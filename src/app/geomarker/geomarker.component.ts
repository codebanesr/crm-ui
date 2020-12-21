import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Plugins } from '@capacitor/core';


const { Geolocation } = Plugins;

@Component({
  selector: 'app-geomarker',
  templateUrl: './geomarker.component.html',
  styleUrls: ['./geomarker.component.scss'],
})
export class GeomarkerComponent implements OnInit{
  @ViewChild(MapInfoWindow, {static: false}) infoWindow: MapInfoWindow;

  center = {lat: 24, lng: 12};
  markerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 14;
  display?: google.maps.LatLngLiteral;
  vertices: google.maps.LatLngLiteral[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {coordinates: google.maps.LatLngLiteral[]}
  ) {}

  ngOnInit() {  
    this.center = this.data.coordinates[0];
    console.log(this.data.coordinates);
    this.vertices = this.data.coordinates;
    this.markerPositions = this.data.coordinates;
  }
  
  // addMarker(event: google.maps.MouseEvent) {
  // }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }

  removeLastMarker() {
    this.markerPositions.pop();
  }
}
