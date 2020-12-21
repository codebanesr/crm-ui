import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { BatteryStatusResponse } from '@ionic-native/battery-status/ngx';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  listAgentActions(skip: number, campaignId: string, fileType?: string) {
    let url = `${environment.apiUrl}/agent/listActions?skip=${skip}`;
    if(fileType) {
      url+=`&fileType=${fileType}`;
    }
    url += `&campaign=${campaignId}`;
    return this.http.get(url);
  }

  fileUrl: any;
  downloadExcelFile(location: string, fileName:string = "unnamed") {
    this.http.get(`${environment.apiUrl}/agent/download?location=${location}`, { responseType: 'arraybuffer' }).subscribe((data: any)=>{
      const blob = new Blob([data], { type: 'application/octet-stream' });
      saveAs(blob, fileName+".xlsx");
    })
  }


  updateBatteryStatus(batLvl: Number) {
    return this.http.post(`${environment.apiUrl}/agent/batteryStatus`, {batLvl});
  }
}
