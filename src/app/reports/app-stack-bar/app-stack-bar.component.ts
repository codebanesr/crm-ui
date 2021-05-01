import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, registerInteraction } from '@antv/g2';

@Component({
  selector: 'app-stack-bar',
  templateUrl: './app-stack-bar.component.html',
  styleUrls: ['./app-stack-bar.component.scss'],
})
export class StackBarChart implements OnDestroy, OnChanges {

  constructor(private ngZone: NgZone) {}

  @ViewChild("avgCallDuration", { static: true }) avgCallDuration: ElementRef;

  private chart: Chart;

  ngOnChanges() {
    if(this.chart) {
      this.ngZone.runOutsideAngular(() => this.ngOnDestroy());
    }
    setTimeout(()=>{
      this.ngZone.runOutsideAngular(()=> this.install());
    }, 0)
  }
  
  @Input() data: any[];
  @Input() XAxisLabel: string = 'month';
  @Input() YAxisLabel = 'sales';
  @Input() max = 500;

  @Input() title = 'Average Call Duration'


  install() {
    registerInteraction('element-link', {
      start: [
        {trigger: 'interval:mouseenter', action: 'element-link-by-color:link'}
      ],
      end: [
        {trigger: 'interval:mouseleave', action: 'element-link-by-color:unlink'}
      ]
    });

    
    this.chart = new Chart({
      container: this.avgCallDuration.nativeElement,
      autoFit: true,
      height: 350,
    });
    
    this.chart.data(this.data);
    this.chart.scale({
      [this.YAxisLabel]: {
        // max: this.max,
        // tickInterval: this.max/2,
        nice: true
      },
    });
    
    this.chart.tooltip({
      showMarkers: false
    });
    
    this.chart
      .interval()
      .position(`${this.XAxisLabel}*${this.YAxisLabel}`)
      .color('type')
      .adjust('stack');
    
    this.chart.interaction('element-highlight-by-color');
    this.chart.interaction('element-link');    

    this.chart.theme({ "styleSheet": { "brandColor": "#025DF4", "paletteQualitative10": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF"], "paletteQualitative20": ["#025DF4", "#DB6BCF", "#2498D1", "#BBBDE6", "#4045B2", "#21A97A", "#FF745A", "#007E99", "#FFA8A8", "#2391FF", "#FFC328", "#A0DC2C", "#946DFF", "#626681", "#EB4185", "#CD8150", "#36BCCB", "#327039", "#803488", "#83BC99"] } });
    this.chart.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
