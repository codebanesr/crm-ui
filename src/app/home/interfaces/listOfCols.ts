import {
  NzTableSortOrder,
  NzTableSortFn,
  NzTableFilterList,
  NzTableFilterFn,
} from "ng-zorro-antd/table/public-api";

export interface ColumnItem {
  name: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
}

export interface DataItem {
  leadStatus: string;
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  followUp: number;
  description: string;
  active: boolean;
}

export const listOfColumns: ColumnItem[] = [
  {
    name: "Name",
    sortOrder: null,
    sortFn: (a: DataItem, b: DataItem) =>
      a.firstName.localeCompare(b.firstName),
    // listOfFilter: [
    //   { text: 'Joe', value: 'Joe' },
    //   { text: 'Jim', value: 'Jim' }
    // ],
    filterFn: (list: string[], item: DataItem) =>
      list.some((name) => item.firstName.indexOf(name) !== -1),
  },
  {
    name: "Email",
    sortOrder: null,
    sortFn: (a: DataItem, b: DataItem) => a.email.localeCompare(b.email),
  },
  {
    name: "Phone Number",
    sortFn: (a: DataItem, b: DataItem) =>
      a.phoneNumber.localeCompare(b.phoneNumber),
  },
  {
    name: "Amount",
    sortFn: (a: DataItem, b: DataItem) => a.amount - b.amount,
  },
  {
    name: "Follow up",
  },
  {
    name: "Description",
  },
];
