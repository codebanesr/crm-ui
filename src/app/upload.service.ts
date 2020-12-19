import { HttpClient } from "@angular/common/http";
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

  constructor(
    private http: HttpClient
  ) {}

  async uploadFile(key: string, file: any): Promise<{Location: string}> {
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

  async uploadArrayBuffer(buffer, name) {
    const params = {
      Bucket: "molecule.static.files",
      Key: name,
      Body: buffer,
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

  getFileFromUri(blobUri: string) {
    return this.http.get(blobUri, {responseType: 'arraybuffer'});
  }
}
