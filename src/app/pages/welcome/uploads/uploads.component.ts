import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { CustomerService } from 'src/app/customer.service';
import { NzMarks } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent  {

  constructor(private msg: NzMessageService, private customerService: CustomerService){}

  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }



  hGutter = 16;
  vGutter = 16;
  count = 3;
  array1 = [{
    name: "customer",
    url: "http://localhost:3000/customer/many?type=customer"
  }, {
    name: "lead",
    url: "http://localhost:3000/customer/many?type=lead"
  }, {
    name: "ticket",
    url: "http://localhost:3000/customer/many?type=ticket"
  }]


  array2 = [{
    name: "campaign",
    url: "http://localhost:3000/customer/many?type=campaign"
  },
  {
    name: "users",
    url: "http://localhost:3000/user/many"
  }]

  reGenerateArray(count: number): void {

  }

}
