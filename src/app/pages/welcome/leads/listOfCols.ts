import { NzTableSortOrder, NzTableSortFn, NzTableFilterList, NzTableFilterFn } from 'ng-zorro-antd/table/public-api';

export interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
}

export interface DataItem {
  externalId: string;
  name: string;
  email: string;
  phonenumber: string;
  amount: number;
  followUpDate: number;
  description: string;
}


export const listOfColumns: ColumnItem[] = [
  {
    name: 'Name',
    sortOrder: null,
    sortFn: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
    // listOfFilter: [
    //   { text: 'Joe', value: 'Joe' },
    //   { text: 'Jim', value: 'Jim' }
    // ],
    filterFn: (list: string[], item: DataItem) => list.some(name => item.name.indexOf(name) !== -1)
  },
  {
    name: 'Email',
    sortOrder: null,
    sortFn: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email)
  },
  {
    name: 'Phone Number',
    sortFn: (a:DataItem, b: DataItem) => a.phonenumber.localeCompare(b.phonenumber)
  },
  {
    name: 'Amount',
    sortFn: (a:DataItem, b: DataItem) => a.amount - b.amount
  },
  {
    name: 'Follow up'
  },
  {
    name: 'Description'
  }
];
