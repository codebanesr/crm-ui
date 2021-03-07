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
    setTimeout(()=>{
      this.ngZone.runOutsideAngular(()=> this.install());
    }, 0)
  }
  
  @Input() data: any[];
  @Input() XAxisLabel: string = 'month';
  @Input() YAxisLabel = 'sales';
  @Input() max = 2400;

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
      height: 500,
    });
    
    this.chart.data(this.data);
    this.chart.scale({
      [this.YAxisLabel]: {
        max: this.max,
        tickInterval: this.max/2,
        nice: true,
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


    this.chart.render();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.ngZone.runOutsideAngular(() => this.chart.destroy());
    }
  }
}
