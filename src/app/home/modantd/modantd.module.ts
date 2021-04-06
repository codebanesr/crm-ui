import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzContextMenuServiceModule, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    NzDescriptionsModule,
    NzContextMenuServiceModule,
    NzDropDownModule,
    NzDrawerModule,
    NzDividerModule,
    NzTreeModule,
    NzLayoutModule,
    NzI18nModule,
    NzMessageModule,
    NzModalModule,
    NzEmptyModule,
    NzPaginationModule,
    NzUploadModule,
    NzTimelineModule
  ]
})
export class ModantdModule { }
