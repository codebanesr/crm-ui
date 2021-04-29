import { Pipe, PipeTransform } from '@angular/core';
import { isObject } from 'lodash';

@Pipe({
  name: 'objectkeys'
})
export class ObjectkeysPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any[] {
    if(!isObject(value)) {
      return value;
    }
    

    return Object.keys(value);
  }

}
