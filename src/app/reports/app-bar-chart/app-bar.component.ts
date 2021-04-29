// primary d
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Chart } from "@antv/g2";

export interface G2MiniBarData {
  genre: any;
  sold: any;
  [key: string]: any;
}

@Component({
  selector: "app-bar",
  templateUrl: "./app-bar.component.html",
  styleUrls: ["./app-bar.component.scss"],
})
export class BarChartComponent implements OnChanges {
  private chart: Chart;
  @Input() padding = [2, 2, 2, 2];
  @Input() title = 'Average Call Metric';

  constructor(private ngZone: NgZone) {}

  /** @param type: x-axis, value: y-axis, percent: tooltip */
  @Input() data : {type: string, value: number, percent: number }[] = [];

  @ViewChild("g2MinBar", { static: true }) g2MinBar: ElementRef;


  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => this.chart?.destroy());
    setTimeout(()=>{
      this.ngZone.runOutsideAngular(() => this.install());
    }, 0);
  }

  install() {
    this.chart = new Chart({
      container: this.g2MinBar.nativeElement,
      autoFit: true,
      height: 500,
      padding: [50, 20, 50, 20],
    });

    this.chart.data(this.data);
    this.chart.scale("value", {
      alias: "Total Calls",
    });

    this.chart.axis("type", {
      tickLine: {
        alignTick: false,
      },
    });
    this.chart.axis("value", false);

    this.chart.tooltip({
      showMarkers: true,
    });
    this.chart.interval().position("type*value");
    this.chart.interaction("element-active");

    this.data.forEach((item) => {
      this.chart
        .annotation()
        .text({
          position: [item.type, item.value],
          content: item.value,
          style: {
            textAlign: "center",
          },
          offsetY: -30,
        })
        .text({
          position: [item.type, item.value],
          // content: (item.percent * 100).toFixed(0) + "%",
          // content: "percentage",
          style: {
            textAlign: "center",
          },
          offsetY: -12,
        });
    });
    this.chart.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
