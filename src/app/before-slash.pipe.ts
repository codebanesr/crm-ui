import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'beforeSlash'
})
export class BeforeSlashPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(!value) {
      return value;
    }
    
    if(value.indexOf("/") === -1) {
      return value;
    }

    return value.split("/")[0];
  }

}
