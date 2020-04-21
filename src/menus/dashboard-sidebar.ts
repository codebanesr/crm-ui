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
                    title: "1st link",
                    show: true
                },{
                    title: "2nd link",
                    show: true
                }
            ]
        },{
            title: "Welcome 2",
            icon: "dashboard",
            open: false,
            hasChildren: true,
            show: true,
            subMenus: [{
                title: "3rd link",
                show: true
            },{
                title: "4th link",
                show: true
            }]
        },{
            title: "Welcome 2",
            open: true,
            icon: "dashboard",
            hasChildren: true,
            show: true,
            subMenus: []
        }
    ]
}