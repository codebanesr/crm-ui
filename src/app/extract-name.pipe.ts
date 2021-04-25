import { Pipe, PipeTransform } from '@angular/core';
import { ILead } from './home/interfaces/leads.interface';

@Pipe({
  name: 'extractName'
})
export class ExtractNamePipe implements PipeTransform {

  transform(lead: ILead, ...args: unknown[]): unknown {
    let name = "";
    if(lead.fullName) {
      return lead.fullName;
    }
    if(lead.firstName) {
      name+=lead.firstName
    }

    if(lead.lastName) {
      name+=lead.lastName;
    }


    return name;
  }

}
