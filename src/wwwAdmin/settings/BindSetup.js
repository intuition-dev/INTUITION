class BindSetup {
    constructor() {
        this.AdminWebAdmin = new AdminWebAdmin()
    }

    setupApp(item) {
        console.log("TCL: BindLogin -> setupShop -> shopConfigs", item)
        $('.loader').addClass('active');
        this.AdminWebAdmin.setupApp(item)
            .then(function(result) {
                console.info("--result:", result)
                $('.loader').removeClass('active');
                window.location = '/admin/crudEditors';
            })
    }
}