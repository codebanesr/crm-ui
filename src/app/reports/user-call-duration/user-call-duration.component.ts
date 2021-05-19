import { Component, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Chart } from '@antv/g2';
import { UserCallDuration } from './user-call-duration.interface';

@Component({
  selector: 'app-user-call-duration',
  templateUrl: './user-call-duration.component.html',
  styleUrls: ['./user-call-duration.component.scss'],
})
export class UserCallDurationComponent implements OnChanges {
  private chart: Chart;
  @Input() data: UserCallDuration[];
  @Input() title: string = '';
  constructor(private ngZone: NgZone) { }

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => this.chart?.destroy());
    
    this.ngZone.runOutsideAngular(() => {
      setTimeout(()=>{
        this.install();
      }, 0);
    });
  }

  @ViewChild("userCallDuration", { static: true }) interaction: ElementRef;
  install() {
    let maxDuration = 0;
    this.data.forEach(d => {
      if (d.duration > maxDuration) {
        maxDuration = d.duration;
      }
    });

    this.chart = new Chart({
      container: this.interaction.nativeElement,
      autoFit: true,
      height: 350,
    });
    this.chart.data(this.data);

    this.chart.scale('duration', {nice: true})
    this.chart.coordinate().transpose();

    this.chart.tooltip({showMarkers: false});


    this.chart.interaction('active-region');

    // this.chart.interval().position('email*duration');


    this.chart.interval().adjust('stack').position('email*duration');
      // .color('interval')
    this.chart.axis('duration', {
      label: {
        formatter: (val) => {
          // return (new Date(+val * 1000).toISOString().substr(11, 8))
          return val;
        }
      }
    });

    this.data.forEach(item=>{
      this.chart.annotation()
        .text({
          position: [item.email, item.duration],
          content: item.duration + "s",
          style: {
            textAlign: 'center'
          },
        })
    })
    this.chart.render();
  }

}
