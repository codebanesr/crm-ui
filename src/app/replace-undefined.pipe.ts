import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'lodash';

@Pipe({
  name: 'replaceUndefined'
})
export class ReplaceUndefinedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(isString(value)) {
      return value.replace("undefined", "");
    }
    return value;
  }

}
