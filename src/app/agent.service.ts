import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  listAgentActions(skip: number) {
    return this.http.get(`${environment.apiUrl}/agent/listActions?skip=${skip}`);
  }



  fileUrl: any;
  downloadExcelFile(location: string) {

    this.http.get(`${environment.apiUrl}/agent/download?location=${location}`, { responseType: 'arraybuffer' }).subscribe((data: any)=>{
      const blob = new Blob([data], { type: 'application/octet-stream' });

      saveAs(blob, "some.xlsx");
    })
  }

}
