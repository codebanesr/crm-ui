import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Chart, Util } from "@antv/g2";


interface IChartData {
  type: string, value: number
}

@Component({
  selector: "app-pie",
  templateUrl: "./pie.component.html",
  styleUrls: ["./pie.component.scss"],
})
export class InteractionComponent implements OnChanges, OnDestroy {
  constructor(private ngZone: NgZone) {}

  @Input() data: Record<string, string>[];

  @ViewChild("interaction", { static: true }) interaction: ElementRef;
  private chart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => this.chart?.destroy());
    
    this.ngZone.runOutsideAngular(() => {
      setTimeout(()=>{
        this.install();
      }, 0);
    });
  }

  install() {
    this.chart = new Chart({
      container: this.interaction.nativeElement,
      autoFit: true,
      height: 500,
    });
    this.chart.data(this.data);

    this.chart.coordinate("theta", {
      radius: 0.75,
    });
    this.chart.tooltip({
      showMarkers: false,
    });

    const interval = this.chart
      .interval()
      .adjust("stack")
      .position("value")
      .color("type", ["#9c27b0", "#3f51b5", "#ffd740", "#e91e63", "#f44336", "#607d8b"])
      .style({ opacity: 0.4 })
      .state({
        active: {
          style: (element) => {
            const shape = element.shape;
            return {
              matrix: Util.zoom(shape, 1.1),
            };
          },
        },
      })
      .label("type", (val) => {
        const opacity = val === "Not Interested" ? 1 : 0.5;
        return {
          offset: -30,
          style: {
            opacity,
            fill: "white",
            fontSize: 12,
            shadowBlur: 2,
            shadowColor: "rgba(0, 0, 0, .45)",
          },
          content: (obj) => {
            return obj.type + "\n" + obj.value + "%";
          },
        };
      });

    this.chart.interaction("element-single-selected");

    this.chart.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
