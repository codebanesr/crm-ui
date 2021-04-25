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
  accessToken: string;
  email: string;
  fullName: string;
  refreshToken: string;
  roleType: string;
  organization: string
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
  key: string, 
  title: string, 
  children?: IChildren[], 
  isLeaf: boolean,
  level?: number,
  selected: boolean,
  expanded?: boolean
}


export interface CampaignConfigEntry {
  configLabel: string, configValue: string, elementTypes: any[], configType: string
}


export interface IConfig {
  checked?: boolean;
  internalField: string;
  name?: string;
  organization?: string;
  readableField: string;
  type: string;
  _id?: string;
  campaignId: string
}