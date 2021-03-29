export interface ICampaign {
  _id: string; //objectid
  campaignName: string;
  comment: string;
  createdAt: string;
  createdBy: string; //ObjectId
  type: string;
  updatedAt: string; //date obj,
  organization: string; //mongoose obj
  editableCols: string[];
  browsableCols: string[];
  formModel: any;
  assignTo: string[];
  advancedSettings: string[];
  uniqueCols: string[];
  archived: boolean;
  startDate: string;
  endDate: string;
  groups: { label: string; value: string[]; _id: string }[];
  autodialSettings: {
    active: boolean,
    cdts: number,
    cpts: number,
    mfupd: number
  }
}




export interface IGetCampaigns {
  data: ICampaign[];
  interval: string[];
  metadata: { total: number; page: number };
  quickStatsAgg: {
    campaign: string;
    followUp: number;
    overdue: number;
  };
}