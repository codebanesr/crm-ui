import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TellecallerCallDetails } from './telecaller-talktime.interface';

@Component({
  selector: "app-telecaller-talktime",
  templateUrl: "./telecaller-talktime.component.html",
  styleUrls: ["./telecaller-talktime.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelecallerTalktimeComponent implements OnChanges {
  constructor() {}
  displayedColumns: (keyof TellecallerCallDetails)[] = [
    "email",
    "answered",
    "unAnswered",
    "totalTalktime",
    "averageTalktime",
  ];

  @Input() dataSource: TellecallerCallDetails[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dataSource)
  }
}
