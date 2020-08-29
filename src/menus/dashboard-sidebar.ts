//  ["viewSoloLeads", "viewTickets", "viewAlarms", "listCampaigns", "viewUsers", "viewLeads", "performance", "createCampaigns"]
import { routePoints } from '../menus/routes';
export default (permissions: string[]) => {
  return [
    permissions.includes("performance") && {
      title: "Dashboard",
      icon: "radar-chart",
      show: true,
      hasChildren: true,
      open: true,
      subMenus: [
        {
          title: "Performance",
          show: true,
          link: routePoints.OVERVIEW
        }
      ]
    },
    {
      title: "Welcome",
      icon: "dashboard",
      show: true,
      hasChildren: true,
      open: true,
      subMenus: [
        permissions.includes("viewUsers") && {
          title: "Users",
          show: true,
          link: routePoints.USERS
        },
        permissions.includes("viewLeads") && {
          title: "Leads",
          show: true,
          link: routePoints.LEADS_ALL
        },
        permissions.includes("viewLeadsSolo") && {
          title: "Lead Solo",
          show: true,
          link: routePoints.LEAD_SOLO
        },
        permissions.includes("viewTickets") && {
          title: "Tickets",
          show: true,
          link: routePoints.TICKETS
        },
        permissions.includes("viewUploads") && {
          title: "Uploads",
          show: true,
          link: routePoints.UPLOADS
        },
        permissions.includes("viewAlarms") && {
          title: "Alarms",
          show: true,
          link: routePoints.ALARMS
        }
      ].filter(e=>!!e)
    }, {
      title: "Campaigns",
      icon: "alipay",
      show: true,
      hasChildren: true,
      open: false,
      subMenus: [
        permissions.includes("listCampaigns") &&{
          title: "List",
          show: true,
          link: routePoints.LIST_CAMPAIGN
        },
        permissions.includes("createCampaigns") && {
          title: "Create",
          show: true,
          link: routePoints.CREATE_CAMPAIGN
        }
      ].filter(e=>!!e)
    }, {
      title: "ROLE",
      icon: "radar-chart",
      show: true,
      hasChildren: true,
      open: true,
      subMenus: [
        {
          title: "List",
          show: true,
          link: routePoints.ROLE
        },
        {
          title: "Create",
          show: true,
          link: routePoints.ROLE_CREATE
        },
        {
          title: "Permissions",
          show: true,
          link: routePoints.PERMISSION
        }
      ]
    },
  ].filter(e=>!!e)
}
