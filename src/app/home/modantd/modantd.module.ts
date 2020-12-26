import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

import { NzPaginationModule } from 'ng-zorro-antd/pagination';
// import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
// import { NzPopoverModule } from 'ng-zorro-antd/popover';
// import { NzProgressModule } from 'ng-zorro-antd/progress';
// import { NzRadioModule } from 'ng-zorro-antd/radio';
// import { NzRateModule } from 'ng-zorro-antd/rate';
// import { NzResultModule } from 'ng-zorro-antd/result';
// import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
// import { NzSliderModule } from 'ng-zorro-antd/slider';
// import { NzSpinModule } from 'ng-zorro-antd/spin';
// import { NzStatisticModule } from 'ng-zorro-antd/statistic';
// import { NzStepsModule } from 'ng-zorro-antd/steps';
// import { NzSwitchModule } from 'ng-zorro-antd/switch';
// import { NzTableModule } from 'ng-zorro-antd/table';
// import { NzTabsModule } from 'ng-zorro-antd/tabs';
// import { NzTagModule } from 'ng-zorro-antd/tag';
// import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
// import { NzTimelineModule } from 'ng-zorro-antd/timeline';
// import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
// import { NzTransferModule } from 'ng-zorro-antd/transfer';
// import { NzTreeModule } from 'ng-zorro-antd/tree';
// import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
// import { NzTypographyModule } from 'ng-zorro-antd/typography';
// import { NzUploadModule } from 'ng-zorro-antd/upload';
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
    NzPageHeaderModule,
    NzPaginationModule,
    NzUploadModule,
    NzTimelineModule
  ]
})
export class ModantdModule { }
