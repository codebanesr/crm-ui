import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AgentService } from 'src/app/agent.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-admin-actions',
  templateUrl: './admin-actions.component.html',
  styleUrls: ['./admin-actions.component.scss']
})
export class AdminActionsComponent implements OnInit {
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: any[] = [];

  constructor(
    private msg: NzMessageService,
    private agentService: AgentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.agentService.listAgentActions(this.list.length).subscribe((res: any) =>{
      this.initLoading = false;
      this.list = res;
    }, error=>{
      console.log(error);
    })
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.getData();

  }

  download(item: any): void {
    this.agentService.downloadExcelFile(item.filePath);
  }
}
