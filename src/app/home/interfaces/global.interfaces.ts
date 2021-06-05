import { field } from "src/global.model";

/** Class validator error interface */
export interface ClassValidationError {
  statusCode: number;
  message: string[];
  error: string;
}

export interface ModelInterface {
  _id?: string;
  name: string;
  description: string;
  theme: any;
  attributes: Array<field>;
}

export interface CurrentUser {
  _id: string;
  accessToken: string;
  email: string;
  fullName: string;
  refreshToken: string;
  roleType: string;
  organization: string;
}

export interface ITypeDict {
  [key: string]: {
    label: string;
    value: string;
    type: string;
    checked: boolean;
    options: any[];
  };
}

export interface IChildren {
  key: string;
  title: string;
  children?: IChildren[];
  isLeaf: boolean;
  level?: number;
  selected: boolean;
  expanded?: boolean;
}

export interface CampaignConfigEntry {
  configLabel: string;
  configValue: string;
  elementTypes: any[];
  configType: string;
}

export interface IConfig {
  checked?: boolean;
  internalField: string;
  name?: string;
  organization?: string;
  readableField: string;
  type: string;
  _id?: string;
  campaignId: string;
}

export enum OrganizationalType {
  TRIAL = "TRIAL",
  MONTHLY = "MONTHLY",
  QUATERLY = "QUATERLY",
  YEARLY = "YEARLY",
}

export interface Organization {
  _id: string;
  name: string;
  accountType: OrganizationalType;
  phoneNumber: String;
  phoneNumberPrefix: string;
  email: string;
  lastActive: string;
  organizationImage: string;
  startDate: Date;
  endDate: Date;
  size: number;
  currentSize: number;
}

export interface OrderCreated {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: "INR";
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: {
    notes_key_1: string;
    notes_key_2: string;
  };
  created_at: number;
}
class OrderMeta {
  perUserRate: number;
  discount: number;
  seats: number;
  total: number;
  months: number;
}
export class CreateOrderDto {
  amount: number;
  currency: string;
  notes: OrderMeta;
}

export interface RazorpayVerification {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export enum RAZORPAY_VerificationType {
  OK = "OK",
  INVALID = "INVALID",
}


export enum RoleType {
  frontline = "frontline",
  manager = "manager",
  reseller = "reseller",
  seniorManager = "seniorManager",
  superAdmin = "superAdmin",
  admin = 'admin'
}
