import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PubsubService } from 'src/app/pubsub.service';
import { HEADER_FILTERS } from 'src/global.constants';
import { MenuElement } from './menu-element.interface';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent implements OnChanges, OnInit {
  constructor(
    private pubsub: PubsubService,
    private menuController: MenuController,
    @Inject(DOCUMENT) private document: any,


    private ref: ChangeDetectorRef
  ) { }

  elem: any;
  @Input() organizationName: string = '';


  menuItems: MenuElement[] = []
  ngOnInit() {
    this.elem = document.documentElement;
    this.pubsub.$sub(HEADER_FILTERS, (data: MenuElement[]) => {
      this.menuItems = data;
      this.ref.detectChanges(); // since we are using onPush strategy we have to do this manually
    });
  }

  ngOnChanges(changes: SimpleChanges) {
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
