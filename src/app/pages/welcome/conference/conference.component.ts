import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  title = `Molecule's conference room`;
  domain: string = "meet.jit.si";
  options: any;
  api: any;


  @ViewChild('jitsi') someInput: ElementRef;
  ngAfterViewInit(): void {

    this.options = {
      roomName: "Molecule_Personal_Space",
      width: 700,
      height: 700,
      parentNode: document.querySelector('#jitsi')
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  }

}
