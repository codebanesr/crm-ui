import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { CurrentUser } from 'src/app/home/interfaces/global.interfaces';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnChanges, OnInit {
  constructor(
    private menuController: MenuController,
    @Inject(DOCUMENT) private document: any
  ) { }

  elem: any;
  @Input() organizationName: string = '';

  ngOnInit() {
    this.elem = document.documentElement;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
    this.organizationName = changes.organizationName.currentValue;
  }

  openMenu() {
    this.menuController.open();
  }

  isFullScreenEnabled = false;
  openFullscreen() {
    this.isFullScreenEnabled = !this.isFullScreenEnabled;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    this.isFullScreenEnabled = false;
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }
}
