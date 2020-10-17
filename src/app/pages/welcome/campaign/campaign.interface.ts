export interface ICampaign {
  _id: string; //objectid
  campaignName: string;
  comment: string;
  createdAt: string;
  createdBy: string; //ObjectId
  interval: string[];
  type: string;
  updatedAt: string; //date obj,
  organization: string; //mongoose obj
}
