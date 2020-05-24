import { NzTableSortOrder, NzTableSortFn, NzTableFilterList, NzTableFilterFn } from 'ng-zorro-antd/table/public-api';

export interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
}

export interface DataItem {
  _id: string,
  name: string;
  email: string;
  phoneNumber: string;
  assignedTo: string;
  description: string;
  createdAt: string;
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
    sortFn: (a:DataItem, b: DataItem) => a.phoneNumber.localeCompare(b.phoneNumber)
  },
  {
    name: 'Assigned to',
    sortFn: (a:DataItem, b: DataItem) => a.assignedTo.localeCompare(b.assignedTo)
  },
  {
    name: 'Description'
  },
  {
    name: 'Created At'
  }
];
