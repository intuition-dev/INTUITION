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
        console.info("--setup settings comp: start")
        var _this = this
        this.IntuAPI.getConfig()
            .then(function(result) {
                console.info("--setup settings comp:", result)
                riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port, bindSetup: _this })
            }).catch(e => {
                console.log('error ', e)
            })
    }

    //get port
    getPort() {
        this.IntuAPI.getConfig()
            .then(function(result) {
                $('.js-goto-editors').attr('href', 'http://localhost:' + result.port + '/editors/');
            });
    }

    //save path and/or port
    saveConfig(serialize) {
        console.log("TCL: BindSettings -> saveConfig -> serialize", serialize)
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

        var printfulAPI = serialize.filter(function(ser) {
            if (ser.name == 'printfulAPI') {
                return ser
            }
        })[0].value
        console.log("TCL: BindSettings -> saveConfig -> printfulApi", printfulAPI)

        this.IntuAPI.updateConfig(port, path, printfulAPI)
            .then(function(result) {
                console.info("--result:", result)
                if (port != window.apiPort) {
                    window.location.href = "/admin"
                }
                //update form
                //  riot.mount('settings-comp', { pathToSite: result.pathToSite, port: result.port, bindSetup: _this })
            })

    }
}
