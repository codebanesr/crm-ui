import { Component, NgModule, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EChartOption } from 'echarts';



@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  config: any;
  chartOption: EChartOption;
  @ViewChild('myChart') myChart: ElementRef;
  labelOption: any;


  ngOnInit() {
    this.initChartConfig();
    this.initLabelOptions();
    this.initChartOptions();
  }



  initLabelOptions() {
    this.labelOption = {
      show: true,
      position: this.config.position,
      distance: this.config.distance,
      align: this.config.align,
      verticalAlign: this.config.verticalAlign,
      rotate: this.config.rotate,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: '#fff'
        }
      }
    }
  }


  initChartConfig() {
    this.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'top',
      distance: 15,
      onChange: function () {
        var labelOption = {
          normal: {
            rotate: this.config.rotate,
            align: this.config.align,
            verticalAlign: this.config.verticalAlign,
            position: this.config.position,
            distance: this.config.distance
          }
        };
        this.myChart.setOption({
          series: [{
            label: labelOption
          }, {
            label: labelOption
          }, {
            label: labelOption
          }, {
            label: labelOption
          }]
        });
      }
    }
  }


  initChartOptions() {
    this.chartOption = {
      color: ['#e78c45', '#300b05', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: ['Converted', 'Dropped', 'Positive', 'Negative']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'left',
        top: 'center',
        feature: {
          mark: { show: true, title: "mark" },
          dataView: { show: true, readOnly: false, title: "data view" },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'], title: "magic" },
          restore: { show: true, title: "restore" },
          saveAsImage: { show: true, title: "download" }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['Shanur', 'Kunal', 'Akshay', 'Amandeep']
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {show: false},
          max: function (value) {
            return value.max + 100;
          }

        }
      ],
      series: [
        {
          name: 'Converted',
          type: 'bar',
          barGap: 0,
          label: this.labelOption,
          data: [320, 332, 301, 334, 390]
        },
        {
          name: 'Dropped',
          type: 'bar',
          label: this.labelOption,
          data: [220, 182, 191, 234, 290]
        },
        {
          name: 'Positive',
          type: 'bar',
          label: this.labelOption,
          data: [150, 232, 201, 154, 190]
        },
        {
          name: 'Negative',
          type: 'bar',
          label: this.labelOption,
          data: [98, 77, 101, 99, 40]
        }
      ]
    }
  }
}
