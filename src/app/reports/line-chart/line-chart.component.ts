import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Chart } from "@antv/g2";
import { GraphService } from "../graphs/graphs.service";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent implements OnInit, OnDestroy {
  constructor(
    private ngZone: NgZone,
    private graphService: GraphService
  ) {}

  @ViewChild("lineChart", { static: true }) lineChart: ElementRef;
  private chart: Chart;
  ngOnInit() {
    setTimeout(() => {
      console.log("runnning outside angular")
      this.ngZone.runOutsideAngular(() => {
        this.graphService.getLeadStatusLineData(2021).subscribe((data: any)=>{
          this.data = data;
          this.install()
        });
      });
    }, 0);
  }


  @Input() title: string = 'Lead State Summary';
  @Input() data: {month: string, leadStatus: string, total: number}[] = [];

  install() {
    this.chart = new Chart({
      container: this.lineChart.nativeElement,
      autoFit: true,
      height: 500,
    });

    this.chart.data(this.data);
    this.chart.scale({
      month: {
        range: [0, 1],
      },
      total: {
        nice: true,
      },
    });

    this.chart.tooltip({
      showCrosshairs: true,
      shared: true,
    });

    this.chart.axis("total", {
      label: {
        formatter: (val) => {
          return val;
        },
      },
    });

    this.chart
      .line()
      .position("month*total")
      .color("leadStatus")
      .shape("smooth");

    this.chart
      .point()
      .position("month*total")
      .color("leadStatus")
      .shape("circle")
      .style({
        stroke: "#fff",
        lineWidth: 1,
      });

    this.chart.theme({ "styleSheet": { "brandColor": "#025DF4", "paletteQualitative10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"], "paletteQualitative20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"] } });
    this.chart.removeInteraction("legend-filter"); // 移除默认的 legend-filter 数据过滤交互
    this.chart.interaction("legend-visible-filter"); // 使用分类图例的图形过滤

    this.chart.render();
  }


  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
