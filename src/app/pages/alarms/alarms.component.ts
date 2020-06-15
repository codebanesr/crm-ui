import { Component, OnInit } from '@angular/core';
import { AlarmData } from '../../../interfaces/alarms';
import { AlarmsService } from 'src/app/alarms.service';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit {
  listOfData: AlarmData[] = [];


  constructor(
    private alarmService: AlarmsService
  ) {}

  tableData: any[];
  ngOnInit(): void {
    const data = [];


    this.alarmService.get({}).subscribe((data: any)=>{
      this.listOfData = data;
    },error=>{
      console.log(error)
    })
  }


  visible = false;
  placement: NzDrawerPlacement = 'top';


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
