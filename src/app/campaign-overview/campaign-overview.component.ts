import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-campaign-overview',
  templateUrl: './campaign-overview.component.html',
  styleUrls: ['./campaign-overview.component.scss']
})
export class CampaignOverviewComponent implements OnInit {

  constructor() { }
  chartOption: EChartOption;
  @ViewChild('campaignChart') campaignChart;
  ngOnInit(): void {
    this.initChart();
  }


  initChart() {
    this.chartOption = {
      title: {
        text: 'Campaign Overview',
        subtext: 'Viewing all campaigns',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: ['campaign1', 'campaign2', 'campaign3', 'campaign4', 'campaign5', 'campaign6', 'campaign7', 'campaign8']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ['pie', 'funnel']
          },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: 'Campaign Overview',
          type: 'pie',
          radius: [30, 150],
          center: ['50%', '50%'],
          roseType: 'area',
          data: [
            { value: 10, name: 'campaign1' },
            { value: 5, name: 'campaign2' },
            { value: 15, name: 'campaign3' },
            { value: 25, name: 'campaign4' },
            { value: 20, name: 'campaign5' },
            { value: 35, name: 'campaign6' },
            { value: 30, name: 'campaign7' },
            { value: 40, name: 'campaign8' }
          ]
        }
      ]
    };
  }


  ec: any;
  onChartInit(ec) {
    this.ec = ec;

    this.ec.on('click', (some) => {
      console.log(some);
    });
    // this.ec.on('dblClick', (somemore) => {
    //   console.log(somemore)
    // })
  }
}
