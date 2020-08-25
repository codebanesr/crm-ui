export interface ILeadColumn {
  'internalField': string,
  'name': string,
  '__v': number,
  'readableField': string,
  'type': string,
  checked: boolean
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

export interface ICampaign {
  '_id' : string,
  'campaignName' : string,
  'comment' : string,
  'createdAt' : Date,
  'createdBy' : Date,
  'interval' : [Date],
  'type' : string,
  'updatedAt' : Date
}

