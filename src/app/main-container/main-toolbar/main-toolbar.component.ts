import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CurrentUser } from 'src/app/home/interfaces/global.interfaces';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnChanges {
  constructor(
    private menuController: MenuController
  ) { }

  ngOnChanges(changes: SimpleChanges) {}

  openMenu() {
    this.menuController.open();
  }

}
