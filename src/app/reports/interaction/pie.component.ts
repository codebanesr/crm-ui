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
  @Input() message?: string;

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

    this.chart
    .interval()
    .position('value')
    .color('type')
    .label('type*value', {
      layout: { type: 'pie-spider' },
      labelHeight: 20,
      content: (obj) => `${obj.type} (${obj.value})`,
      labelLine: {
        style: {
          lineWidth: 0.5,
        },
      },
    })
    .adjust('stack');

    this.chart.interaction("element-single-selected");
    this.chart.theme({ "styleSheet": { "brandColor": "#025DF4", "paletteQualitative10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"], "paletteQualitative20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"] } });
    this.chart.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
