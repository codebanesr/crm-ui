import { Pipe, PipeTransform } from '@angular/core';
import { uniq, isArray } from "lodash";

@Pipe({
  name: 'filterUnique'
})
export class FilterUniquePipe implements PipeTransform {

  transform(valueArr: string[], ...args: unknown[]): unknown {
    if(isArray(valueArr)) {
      return uniq(valueArr)
    }
    return valueArr;
  }

}
