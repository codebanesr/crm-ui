export interface ILeadColumn {
  "internalField": string,
  "name": string,
  "__v": number,
  "readableField": string,
  "type": string,
  checked: boolean,
  options: string[]
}

export interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  tableScroll: string;
}
