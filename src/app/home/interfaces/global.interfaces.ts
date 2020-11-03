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
