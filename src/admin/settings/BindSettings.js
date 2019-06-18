class BindSettings {
    constructor() {
        this.IntuAPI = new IntuAPI()
    }

    //install e-com, website or blog, buttons handle
    setupApp(item) {
        $('.loader').addClass('active');
        this.IntuAPI.setupApp(item)
            .then(function(result) {
                console.info("--result:", result)
                $('.loader').removeClass('active');
            })
    }

    //get data for the settings form
    getForm() {
        var _this = this
        this.IntuAPI.getConfig()
            .then(function(result) {
                console.info("--result:", result)
                riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port, bindSetup: _this })
            })
    }

    //save path and/or port
    saveConfig(serialize) {
        var port = serialize.filter(function(ser) {
            if (ser.name == 'port') {
                return ser
            }
        })[0].value
        var path = serialize.filter(function(ser) {
            if (ser.name == 'path') {
                return ser
            }
        })[0].value

        this.IntuAPI.updateConfig(port, path)
            .then(function(result) {
                console.info("--result:", result)

                //update form
                //  riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port, bindSetup: _this })
            })

    }
}