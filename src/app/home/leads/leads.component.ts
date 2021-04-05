import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from "ng-zorro-antd/dropdown";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { PubsubService } from "src/app/pubsub.service";
import { CampaignService } from "../campaign.service";
import { LeadsService } from "../leads.service";
import { UsersService } from "../users.service";
import { Setting } from "./lead.interface";
import { Plugins } from "@capacitor/core";
import { ICampaign } from "src/app/campaign/campaign.interface";
import { LoadingController, ToastController } from "@ionic/angular";
import { ITypeDict } from "../interfaces/global.interfaces";
import { ILead } from "../interfaces/leads.interface";
const { Share } = Plugins;
import { List } from "immutable";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-leads",
  templateUrl: "./leads.component.html",
  styleUrls: ["./leads.component.scss"]
})
export class LeadsComponent {
  constructor(
    private leadsService: LeadsService,
    private nzContextMenuService: NzContextMenuService,
    private router: Router,
    private fb: FormBuilder,
    private usersService: UsersService,
    private campaignService: CampaignService,
    private pubsub: PubsubService,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    private _snackBar: MatSnackBar,
    private userService: UsersService
  ) {}

  page: number = 1;
  perPage: number = 15;
  tagPlaceHolder = 3;
  showFilterDrawer = false;
  showGlobalSearch = false;

  managers = null;
  isTimelineModalVisible = false;

  settingValue!: Setting;

  /** @Todo this should be removed */
  settingForm: FormGroup;
  indeterminate = false;
  checked = false;
  listOfCurrentPageData: any[] = [];

  ionViewWillEnter() {
    this.pubsub.$pub("HEADING", { heading: "Leads" });
    this.populateCampaignDropdown("");
    this.initSettingForm();
    this.initRightClickActions();

    this.initHandlerList();
  }

  tempUserList: any;
  listOfHandlers: any;

  handlerFilter = new FormControl();
  async initHandlerList() {
    this.userService.getAllUsersHack().subscribe((result: any)=>{
      this.tempUserList = result[0].users;
      this.listOfHandlers = result[0].users;
    });

    this.handlerFilter.valueChanges.subscribe((value: string) => {
      this.listOfHandlers = this.tempUserList.filter((v)=>{
        // search in both email and name
        const t = v.fullName + v.email;
        return t.includes(value)
      });
    })
  }

  campaignList: any[];
  selectedCampaign: ICampaign;
  async populateCampaignDropdown(hint: string) {
    this.campaignList = await this.campaignService.populateCampaignDropdown(
      hint
    );

    this.selectedCampaign = this.campaignList[this.campaignList.length - 1];
    this.getDispositionForCampaign();
    this.rerenderCols();
    this.getAllLeadColumns();
  }

  async onCampaignSelect() {
    this.leadOptions.campaignId = this.selectedCampaign._id;
    this.getData();

    // if all campaigns option is selected do not call this api
    if(this.selectedCampaign._id !== 'all') {
      const result = await this.leadsService.getLeadMappings(
        this.selectedCampaign._id,
      );
      this.typeDict = result.typeDict;
    }
  }

  usersCount: number;
  initRightClickActions() {
    this.usersService.getUsers(0, 20, "abc", "asc").subscribe(
      (data: any) => {
        this.managers = data.users;
        this.usersCount = data?.metadata?.total;
      },
      (error) => {
        
      }
    );
  }

  leads: List<ILead>;
  objectkeys = Object.keys;

  leadOptions: {
    page: number;
    campaignId: string;
    perPage: number;
    showCols?: string[];
    searchTerm: string;
    filters?: any;
  } = {
    page: this.page || 1,
    perPage: this.perPage || 1,
    searchTerm: "",
    filters: { assigned: true },
    campaignId: 'all'
  };
  isEmpty: boolean;
  async getData() {
    /** @Todo please prevent big typedict from being passed, look for an alternate route */
    this.leadOptions["typeDict"] = this.typeDict;

    const loader = await this.loadingCtrl.create({
      message: 'Fetching leads',
      spinner: 'bubbles',
      mode: 'md'
    });

    await loader.present();
    this.leadsService.getLeads(this.leadOptions).subscribe((response: {data: ILead[], total: number, page: number}) => {
        loader.dismiss();
        if (response.data.length === 0) {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
          this.leads = List(response.data);
          this.total = response.total;
          this.leadOptions.page = response.page;
        }
      },
      async(error) => {
        const toast = await this.toastController.create({
          message: "Something went wrong ...",
          duration: 2000,
          color: "warning",
        });

        toast.present();
      }
    );
  }

  selectedKeys = []
  nodeClickEvent(event: any) {
    if(event.node._children.length > 0) {
      if(this.selectedKeys.includes(event.node.key)) {
        this.selectedKeys = [];
      }else{
        this.selectedKeys = event.node._children.map(c=>c.key);
        this.selectedKeys.push(event.node.key);
      }
    }else{
      // if key already exists remove it from selected keys otherwise add it
      if(this.selectedKeys.includes(event.node.key)) {
        this.selectedKeys = this.selectedKeys.filter(k=>k!==event.node.key);
      }else{
        this.selectedKeys.push(event.node.key);
      }
    }

    this.leadOptions.filters["leadStatusKeys"] = this.selectedKeys;
    
  }

  typeDict: ITypeDict;
  dataLoaded: boolean = false;
  async getAllLeadColumns() {
    this.loading = true;
    const result = await this.leadsService.getLeadMappings(this.selectedCampaign._id);
    this.typeDict = result.typeDict;
  }

  createLead() {
    this.router.navigate(["welcome", "leads", "create"]);
  }

  listOfSwitch = [
    // { name: 'Ticket', formControlName: 'ticket' },
    { name: "Lead", formControlName: "lead" },
    { name: "Archived", formControlName: "archived" },
    { name: "Upcoming", formControlName: "upcoming" },
  ];

  filterForm: FormGroup;
  initSettingForm() {
    this.settingForm = this.fb.group({
      lead: [true],
      archived: [false],
      upcoming: [false],
      assigned: [true],
      dateRange: [null],
      selectedCampaign: [""],
    });
    this.settingValue = this.settingForm.value;
    this.settingForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.settingValue = value;
        this.leadOptions.filters = {
          ...this.leadOptions.filters,
          ...this.settingForm.value,
        };
        this.getData();
      });
  }

  rerenderCols() {
    this.leadOptions.showCols = this.selectedCampaign.browsableCols;
    this.getData();
  }

  handleSearchTerm() {
    this.getData();
  }

  selectedLeadHistory: any;
  showLeadHistory(lead) {
    let externalId = lead?.externalId;
    this.selectedLead = lead;
    this.leadsService.getHistoryForLead(externalId).subscribe(
      (selectedLeadHistory) => {
        this.selectedLeadHistory = selectedLeadHistory;
        this.isTimelineModalVisible = true;
      },
      async (error) => {
        this.selectedLeadHistory = undefined;
        const toast = await this.toastController.create({
          message: 'Something went wrong.',
          duration: 2000,
          color: 'warn'
        });
        toast.present();
      }
    );
  }

  isVisible = false;
  showEmailModal(leadData): void {
    this.isVisible = true;
    this.selectedLead = leadData;
  }

  handleOk(): void {
    
    this.isVisible = false;
  }

  handleCancel(): void {
    
    this.isVisible = false;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  reassignLead(newManager: any) {
    
    this.leadsService
      .reassignLead(
        this.selectedLead.email,
        newManager.email,
        this.selectedLead
      )
      .subscribe(
        async(result) => {
          const toast = await this.toastController.create({
            message: 'Lead has been reassigned',
            duration: 2000,
            color: 'success'
          });
          toast.present();
        },
        async(error) => {
          const toast = await this.toastController.create({
            message: 'Lead reassignment failed',
            duration: 2000,
            color: 'warn'
          });
          toast.present();
        }
      );
  }

  selectedLead: any;
  // isReassignmentModalVisible;
  // selectedManager: FormControl;
  // openReassignModal(leadData, bulkReassign: boolean = false) {
  //   this.selectedLead = leadData;
  //   this.selectedManager = new FormControl(null);
  //   this.selectedManager.valueChanges.subscribe((data) => {
  //     
  //   });
  //   this.isReassignmentModalVisible = true;
  //   // now show managers on modal, wait for a manager to click and send for reassignment also set the typings file now, its required
  // }

  // handleReassignmentCancel() {
  //   this.isReassignmentModalVisible = false;
  // }

  // handleTimelineClose() {
  //   this.isTimelineModalVisible = false;
  // }

  // handleReassignmentSubmit() {}

  total: number = 1000;
  loading = false;
  onQueryParamsChange(paginator): void {
    
    this.leadOptions.page = paginator.pageIndex;
    this.perPage = paginator.pageSize;
    this.leadOptions.perPage = paginator.pageSize;

    this.leadOptions.page =
      this.leadOptions.page <= 0 ? 1 : this.leadOptions.page;
    this.getData();
  }

  // basicOverview: any;
  // getBasicOverview() {
  //   this.leadsService.getBasicOverview().subscribe(
  //     (basicOverview) => {
  //       this.basicOverview = basicOverview;
  //     },
  //     (error) => {
  //       
  //     }
  //   );
  // }

  // selectedEmailTemplate: any;
  // populateEmailModal(event) {
  //   
  //   this.selectedEmailTemplate = event.nzValue;

  //   this.attachments = this.selectedEmailTemplate.attachments;
  //   this.emailForm.patchValue({
  //     subject: this.selectedEmailTemplate.subject,
  //     content: this.selectedEmailTemplate.content,
  //   });
  // }

  // emailTemplates: any;
  // etFormControl = new FormControl([null]);
  // attachments: any[] = [];
  // initEtAutocomplete() {
  //   this.etFormControl.valueChanges
  //     .pipe(debounceTime(500), distinctUntilChanged())
  //     .subscribe((searchTerm: string) => {
  //       this.campaignService
  //         .getAllEmailTemplates({ searchTerm })
  //         .subscribe((emailTemplates: any) => {
  //           this.emailTemplates = emailTemplates;
  //         });
  //     });
  // }

  // emailForm: FormGroup;
  // emailModel;
  // initEmailForm() {
  //   this.emailForm = this.fb.group({
  //     subject: [null],
  //     content: [null],
  //     attachments: [null],
  //   });
  // }

  // submitEmailForm(model) {
  //   
  // }

  async onSocialShareClick(event, data) {
    await Share.share({
      title: "Molecule CRM",
      text: "Download Molecule crm from playstore",
      url: "https://crm.moleculesystems.com",
      dialogTitle: "Share with Friends",
    });
  }

  closeFilterDrawer() {
    this.showFilterDrawer = false;
  }

  handleLeadEdit(lead) {
    this.router.navigate(["home", "solo"], {
      queryParams: {
        isBrowsed: true,
        campaignId: this.selectedCampaign._id,
        leadId: lead._id,
      },
    });
  }

  handleCreateLead() {
    if(!this.selectedCampaign) {
      const snack_action = this._snackBar.open("No Campaign Selected", "Create Campaign", {duration: 2000});

      snack_action.onAction().subscribe(data=>{
        this.router.navigate(['home', 'campaigns', 'create']);
      })

      return;
    }

    this.router.navigate(["home", "lead-create"], {
      queryParams: {
        campaignId: this.selectedCampaign._id,
      },
    });
  }

  callDispositions;
  getDispositionForCampaign() {
    this.campaignService.getDisposition(this.selectedCampaign._id).subscribe(
      (data: any) => {
        this.callDispositions = data.options;
      },
      (error) => {
        
      }
    );
  }
}
