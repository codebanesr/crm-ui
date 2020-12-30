export interface ITransaction {
  _id?: string;
  organization: string;
  discount: number;
  expiresOn: Date;
  perUserRate: number;
  seats: number;
  total: number;
}

export interface IRowData {
  createdAt: Date;
  credit: number;
  orgId: string;
  orgName: string;
  resellerId: string;
  resellerName: string;
  updatedAt: Date;
  __v: number;
  _id: string;
}
