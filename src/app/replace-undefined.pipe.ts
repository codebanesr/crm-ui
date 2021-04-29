import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'lodash';

@Pipe({
  name: 'replaceUndefined'
})
export class ReplaceUndefinedPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(isString(value)) {
      value = value.replace('Undefined', "");
      return value.replace("undefined", "");
    }
    return value;
  }
}
