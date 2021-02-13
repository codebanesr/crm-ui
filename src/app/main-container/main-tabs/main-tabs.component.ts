import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

/** @Todo change this to onPush strategy, this is just a quick fix */
@Component({
  selector: 'app-main-tabs',
  templateUrl: './main-tabs.component.html',
  styleUrls: ['./main-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainTabsComponent implements OnInit {
  constructor() { }
  ngOnInit() {}
}
