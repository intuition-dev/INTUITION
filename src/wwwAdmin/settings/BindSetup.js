class BindSetup {
    constructor() {
        this.AdminWebAdmin = new AdminWebAdmin()
    }

    setupApp(item) {
        $('.loader').addClass('active');
        this.AdminWebAdmin.setupApp(item)
            .then(function(result) {
                console.info("--result:", result)
                $('.loader').removeClass('active');
            })
    }

    getForm() {
        this.AdminWebAdmin.getConfigs()
            .then(function(result) {
                console.info("--result:", result)
                riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port })
            })
    }
}