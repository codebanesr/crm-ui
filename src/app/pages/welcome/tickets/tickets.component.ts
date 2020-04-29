import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  constructor() { }

  timelineData = [
    {text: "Network problems being solved 2015-09-01", color: "red"},
    {text: "Create a services site 2015-09-01", color: "green", timer: "true"},
    {text: "Network problems being solved 2015-09-01", color: "red"},
    {text: "Technical testing 2015-09-01", color: "yellow"}
  ]

  ngOnInit(): void {
  }
}
