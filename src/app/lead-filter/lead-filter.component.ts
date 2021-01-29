import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, Output } from '@angular/core';


@Component({
  selector: "app-lead-filter",
  templateUrl: "./lead-filter.component.html",
  styleUrls: ["./lead-filter.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadFilterComponent implements OnChanges {
  @Input() typeDict: Map<string, {
    label: string;
    value: string;
    type: string;
    checked: boolean;
    options: any[];
  }>;

  @Input() leadFilter = {};

  constructor() {}

  leadKeys: string[] = [];
  ngOnChanges() {
    if (this.typeDict) {
      this.leadKeys = Object.keys(this.typeDict);
    }
  }
}
