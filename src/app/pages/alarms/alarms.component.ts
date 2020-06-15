import { Component, OnInit } from '@angular/core';
import { AlarmData } from '../../../interfaces/alarms';
import { AlarmsService } from 'src/app/alarms.service';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.scss']
})
export class AlarmsComponent implements OnInit {
  listOfData: AlarmData[] = [];


  constructor(
    private alarmService: AlarmsService,
    private fb: FormBuilder
  ) {}

  tableData: any[];
  listOfOption;
  visible;
  placement: NzDrawerPlacement = 'left';
  ngOnInit(): void {
    const data = [];
    this.visible = false;
    this.listOfOption = ["LEAD", "TICKET", "USER", "CUSTOMER"];

    this.alarmService.get({}).subscribe((data: any)=>{
      this.listOfData = data;
    },error=>{
      console.log(error)
    });


    this.filterForm = this.fb.group({
      handlerEmail: [null],
      dateRange: [null],
      moduleTypes: []
    });
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }


  filterForm!: FormGroup;

  submitForm(): void {
    for (const i in this.filterForm.controls) {
      this.filterForm.controls[i].markAsDirty();
      this.filterForm.controls[i].updateValueAndValidity();
    }
    console.log(this.filterForm.value);
  }
}
