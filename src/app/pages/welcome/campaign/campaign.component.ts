import { Component, OnInit } from '@angular/core';
import {
  NzTableSortOrder,
  NzTableSortFn,
  NzTableFilterList,
  NzTableFilterFn,
} from 'ng-zorro-antd/table';
import { CampaignService } from '../campaign.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzUploadListComponent } from 'ng-zorro-antd/upload';
import { UploadService } from 'src/app/upload.service';

interface DataItem {
  createdBy: string;
  startDate: string;
  endDate: string;
  campaignName: string;
  _id: string;
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
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService
  ) {}

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

    this.campaignService.getAllCampaignTypes().subscribe(
      (campaignOpts: any[]) => {
        this.campaignOpts = campaignOpts;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  listOfColumns: ColumnItem[] = [
    { name: 'Campaign Name' },
    { name: 'Created By' },
    { name: 'Start Date' },
    { name: 'End Date' },
  ];

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
        (data: any) => {
          this.processData(data);
        },
        (error) => {
          this.msg.error(error.message);
        }
      );
  }

  totalPage: number = 0;
  processData(result: {
    data: any[];
    metadata: { total: number; page: number };
  }) {
    this.page = result.metadata.page;
    this.totalPage = result.metadata.total;
    this.listOfData = [];
    for (let d of result.data) {
      this.listOfData.push({
        startDate: d.interval[0],
        endDate: d.interval[1],
        createdBy: d.createdBy,
        campaignName: d.campaignName,
        _id: d._id,
      });
    }
  }
  validateForm!: FormGroup;

  submitForm(): void {
    this.filters = this.validateForm.value;
    this.getCampaigns();
  }

  // welcome/campaigns/create
  activeCampaign: any;
  markActiveCampaign(event: Event, data) {
    event.stopImmediatePropagation();
    this.activeCampaign = data;
  }
  gotoDetailedView(data: any) {
    this.router.navigate(['welcome', 'campaigns', 'create'], {
      queryParams: { id: data._id },
    });
  }

  uploading = false;
  leadFileList: NzUploadListComponent[] = [];
  async handleLeadFilesUpload() {
    this.uploading = true;
    const filePromises = this.leadFileList.map((f) => {
      return this.uploadService.uploadFile('leads', f);
    });

    const result = await Promise.all(filePromises);
    this.campaignService
      .uploadMultipleLeadFiles({
        files: result,
        campaignName: this.activeCampaign.campaignName,
      })
      .subscribe(
        (response: any) => {
          this.uploading = false;
          this.leadFileList = [];
          this.msg.success('Lead Files uploaded successfully.');
        },
        () => {
          this.uploading = false;
          this.msg.error('Lead files could not be uploaded.');
        }
      );
    this.uploading = false;
  }

  beforeLeadFilesUpload = (file: NzUploadListComponent): boolean => {
    this.leadFileList = this.leadFileList.concat(file);
    return false;
  };
}
