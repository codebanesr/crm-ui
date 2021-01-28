export interface IHistory {
    oldUser: string;
    newUser: string;
    lead: string;
    campaignName: string;
    prospectName: string;
    phoneNumber: string;
    followUp: String;
    direction: String;
    notes: string;
    callRecordUrl: string;
    geoLocation: { coordinates: string[] };
    leadStatus: string;
    attachment: string;
    requestedInformation?: { [key: string]: string }[];
    active: boolean;
    createdAt: string;
    nextAction?: string;
    campaign: string;
  }