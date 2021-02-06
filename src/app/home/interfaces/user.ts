
export interface User {
  email: string,
  _id: string,
  createdAt: Date,
  roleType: string,
  managedBy: any
  userLeadActivityDetails: any[],
  fullName: string
}

