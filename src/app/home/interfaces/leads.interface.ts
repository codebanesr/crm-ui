export interface ILead {
  _id: string;
  externalId: string;
  fullName: string;
  __v: number;
  address: string;
  amount: string;
  campaign: string;
  companyName: string;
  createdAt: string;
  customerEmail: string;
  email: string;
  firstName: string;
  followUp: string | Date;
  lastName: string;
  leadStatus: string;
  phoneNumber: string;
  phoneNumberPrefix: string;
  product: string;
  remarks: string;
  source: string;
  updatedAt: string;
  nextAction: string;
  contact: {
    label: string;
    value: string;
    category: string;
  }[];
  history: any;
}
