import {routePoints} from '../menus/routes';
export default ()=> {
    return [
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
                },{
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
                }
            ]
        }
    ]
}