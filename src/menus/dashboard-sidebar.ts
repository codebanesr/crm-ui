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
      open: false,
      subMenus: [
        {
          title: "Users",
          show: true,
          link: routePoints.USERS
        }, {
          title: "Leads",
          show: true,
          link: routePoints.LEADS
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
        }, {
          title: "Create",
          show: true,
          link: routePoints.CREATE_CAMPAIGN
        },
      ]
    },
  ]
}
