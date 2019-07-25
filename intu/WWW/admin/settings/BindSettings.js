class BindSettings {
    constructor() {
        this.settingsViewModel = new SettingsViewModel();
    }

    //install e-com, website or blog, buttons handle
    setupApp(item) {
        $('.loader').addClass('active');
        this.settingsViewModel.setupApp(item)
            .then(function(result) {
                console.info("--result:", result)
                $('.loader').removeClass('active');
            })
    }

    //get data for the settings form
    getForm() {
        console.info("--setup settings comp: start")
        var _this = this
        this.settingsViewModel.getConfig()
            .then(function(result) {
                console.info("--setup settings comp:", result)
                riot.mount('settings-comp', {
                    emailjsService_id: result.emailjsService_id,
                    emailjsTemplate_id: result.emailjsTemplate_id,
                    emailjsUser_id: result.emailjsUser_id,
                    pathToSite: result.pathToApp,
                    port: result.port,
                    bindSetup: _this
                })
            }).catch(e => {
                console.log('error ', e)
            })
    }

    //get port
    getPort() {
        this.settingsViewModel.getConfig()
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

        // var printfulAPI = serialize.filter(function(ser) {
        //     if (ser.name == 'printfulAPI') {
        //         return ser
        //     }
        // })[0].value

        var emailjsService_id = serialize.filter(function(ser) {
            if (ser.name == 'emailjsService_id') {
                return ser
            }
        })[0].value

        var emailjsTemplate_id = serialize.filter(function(ser) {
            if (ser.name == 'emailjsTemplate_id') {
                return ser
            }
        })[0].value

        var emailjsUser_id = serialize.filter(function(ser) {
            if (ser.name == 'emailjsUser_id') {
                return ser
            }
        })[0].value

        this.settingsViewModel.updateConfig(port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id)
            .then(result => {
                console.info("updateConfig --result:", result)
                debugger;
                if (port != window.apiPort) {
                    window.location.href = "/admin"
                }
                //update form
                riot.mount('settings-comp', {
                    pathToSite: result[0].path,
                    port: result[0].port,
                    bindSetup: this,
                    emailjsService_id: result[0].emailjsService_id,
                    emailjsTemplate_id: result[0].emailjsTemplate_id,
                    emailjsUser_id: result[0].emailjsUser_id,
                }); 
            })
    }
}
