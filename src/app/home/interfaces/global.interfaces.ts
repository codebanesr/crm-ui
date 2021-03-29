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