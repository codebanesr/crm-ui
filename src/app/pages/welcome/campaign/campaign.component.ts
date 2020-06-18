import { Component, OnInit } from '@angular/core';
import {
  NzTableSortOrder,
  NzTableSortFn,
  NzTableFilterList,
  NzTableFilterFn,
} from 'ng-zorro-antd/table';
import { CampaignService } from '../campaign.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

interface DataItem {
  handler: string;
  interval: string;
  type: string;
}

interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
}

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit {
  constructor(
    private campaignService: CampaignService,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) { }

  campaignOpts: string[];
  handlerEmailOpts: string[] = ['santa', 'banta'];
  page: number;
  perPage: number;
  filters: any;
  ngOnInit(): void {
    this.page = 1;
    this.perPage = 20;
    this.campaignOpts = ['default'];
    this.validateForm = this.fb.group({
      handlerEmail: [null],
      campaigns: [],
    });

    this.initFormControlListeners();

    this.getCampaigns();

    this.campaignService.getAllCampaignTypes().subscribe((campaignOpts: any[])=>{
      this.campaignOpts = campaignOpts;
    }, error=>{
      console.log(error);
    })
  }
  listOfColumns: ColumnItem[] = [{name: 'handler'},{name: 'interval'},{name: 'type'}];
  listOfData: DataItem[] = [];

  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }

  onPageIndexChange(index: number) {
    this.page = index;
    this.getCampaigns();
  }

  onPageSizeChange(size: number) {
    this.perPage = size;
    this.getCampaigns();
  }

  initFormControlListeners() {
    this.validateForm
      .get('handlerEmail')
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((change) => {
        this.campaignService
          .getHandlerEmailHints(change)
          .subscribe((handlerEmailOpts: string[]) => {
            this.handlerEmailOpts = handlerEmailOpts;
          });
      });
  }

  getCampaigns() {
    this.msg.info('fetched campaigns');
    this.campaignService
      .getCampaigns(this.page, this.perPage, this.filters, null, null)
      .subscribe(
        (data: DataItem[]) => {
          this.listOfData = data;
        },
        (error) => {
          this.msg.error(error.message);
        }
      );
  }

  validateForm!: FormGroup;

  submitForm(): void {
    this.filters = this.validateForm.value;
    this.getCampaigns();
  }
}
