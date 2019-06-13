class BindSetup {
    constructor() {
        this.WebAdmin = new WebAdmin()
    }

    setupApp(item) {
        $('.loader').addClass('active');
        this.WebAdmin.setupApp(item)
            .then(function(result) {
                console.info("--result:", result)
                $('.loader').removeClass('active');
            })
    }

    getForm() {
        this.WebAdmin.getConfigs()
            .then(function(result) {
                console.info("--result:", result)
                riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port })
            })
    }
}