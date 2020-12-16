import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

declare let AWS: any;

@Injectable({
  providedIn: "root",
})
export class UploadService {
  bucket = new AWS.S3({
    accessKeyId: environment.accessKeyId,
    secretAccessKey: environment.secretAccessKey,
    region: "ap-south-1",
  });

  constructor() {}

  async uploadFile(key: string, file: any) {
    const params = {
      Bucket: "molecule.static.files",
      Key: key + file.name,
      Body: file,
    };

    return new Promise((resolve, reject) => {
      this.bucket.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}
