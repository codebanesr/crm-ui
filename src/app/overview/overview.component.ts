import {
  Component,
  NgModule,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardService } from '../pages/welcome/dashboard.service';
import { barChartLabelOption } from './chartOptions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  config: any;
  leadStatusChartOption: EChartOption;
  performanceChartOptions: EChartOption;
  @ViewChild('leadStatusChart') leadStatusChart: ElementRef;
  @ViewChild('performanceChart') performanceChart: ElementRef;
  labelOption: any;

  constructor(private dashboardService: DashboardService) {}

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
          textBorderColor: '#fff',
        },
      },
    };
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
            distance: this.config.distance,
          },
        };
        this.myChart.setOption({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        });
      },
    };
  }

  date = null;
  onChange(e) {
    this.date = e;
    this.initChartOptions();
  }

  initChartOptions() {
    this.initLeadStatusPieChart();
    this.initPerformanceChart();
  }

  initPerformanceChart() {
    this.dashboardService.getLeadStatusByDepartment(this.date).subscribe((data: any[])=>{

      this.performanceChartOptions = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: data.map(d=>d._id),
          orient: 'vertical',
          left: 'left',
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            // this should come from the api
            data: ["NURTURING", "CLOSED"],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: data.map(d=>{
          return {
            name: d._id,
            type: 'bar',
            barGap: 0,
            barWidth: '6%',
            label: barChartLabelOption,
            data: d.leadsWithStatus.map(innerData=>innerData.count)
          }
        })
      };
    }, error=>{
      console.log(error);
    })
  }

  initLeadStatusPieChart() {
    let leadStatusOptions = [];
    let output = [];
    this.dashboardService
      .getAggregatedLeadStatus(this.date)
      .subscribe((result: any[]) => {
        leadStatusOptions = result.map((r) => r._id.leadStatus);

        output = result.map((o) => {
          return { name: o._id.leadStatus, value: o.totalAmount };
        });

        this.leadStatusChartOption = {
          title: {
            text: 'Lead Status',
            subtext: 'This week',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: leadStatusOptions,
          },
          series: [
            {
              name: 'Lead Status',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: output,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
      });
  }
}
