//  ["viewSoloLeads", "viewTickets", "viewAlarms", "listCampaigns", "viewUsers", "viewLeads", "performance", "createCampaigns"]
import { routePoints } from '../menus/routes';
export default () => {
  return [
    {
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
        {
          title: "Users",
          show: true,
          link: routePoints.USERS
        },
        {
          title: "Leads",
          show: true,
          link: routePoints.LEADS_ALL
        },
        {
          title: "Lead Solo",
          show: true,
          link: routePoints.LEAD_SOLO
        },
        {
          title: "Tickets",
          show: true,
          link: routePoints.TICKETS
        },
        {
          title: "Uploads",
          show: true,
          link: routePoints.UPLOADS
        },
        {
          title: "Alarms",
          show: true,
          link: routePoints.ALARMS
        }
      ]
    }, {
      title: "Campaigns",
      icon: "alipay",
      show: true,
      hasChildren: true,
      open: false,
      subMenus: [
        {
          title: "List",
          show: true,
          link: routePoints.LIST_CAMPAIGN
        },
        {
          title: "Create",
          show: true,
          link: routePoints.CREATE_CAMPAIGN
        }
      ]
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
  ]
}
