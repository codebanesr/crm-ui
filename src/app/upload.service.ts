import { Injectable } from '@angular/core';

declare let AWS: any;

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  bucket = new AWS.S3({
    accessKeyId: 'AKIARGBOXP35BONONB4J',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  constructor() {}

  async uploadFile(key: string, file: any) {
    const params = {
      Bucket: 'molecule.static.files',
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
