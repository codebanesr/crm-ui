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
                    show: true,
                    link: "www.google.com"
                },{
                    title: "2nd link",
                    show: true,
                    link: "www.youtube.com"
                },
                {
                    title: "3rd link",
                    show: true,
                    link: "www.facebook.com"
                },{
                    title: "4th link",
                    show: true,
                    link: "www.something.com"
                }
            ]
        }
    ]
}