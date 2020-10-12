import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-tickets',
  template: `
    <nz-row [nzGutter]="16" id="contentToConvert" (click)="convetToPDF()">
      <nz-col [nzSpan]="12">
        <nz-statistic
          [nzValue]="(1949101 | number)!"
          [nzTitle]="'Active Users'"
        ></nz-statistic>
      </nz-col>
      <nz-col [nzSpan]="12">
        <nz-statistic
          [nzValue]="(2019.111 | number: '1.0-2')!"
          [nzTitle]="'Account Balance (CNY)'"
        ></nz-statistic>
      </nz-col>
    </nz-row>
  `,
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  ngOnInit() {

  }

  title = 'html-to-pdf-angular-application';
  public convetToPDF() {
    console.log("clicking")
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4', false); // A4 size page of PDF;
      pdf.internal.scaleFactor = 30;
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
}
