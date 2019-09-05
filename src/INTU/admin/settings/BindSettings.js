var settingsViewModel = null;

depp.define({
    'settingsViewModel': [
        '../models/SettingsViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('settingsViewModel');

depp.require(['ui', 'scripts', 'setup-page'], async function () {
    
    settingsViewModel = await SettingsViewModel.inst();

    getPort(settingsViewModel);

    getForm(settingsViewModel);

    $('#setup-shop').off('click').on('click', function(e) {
        setupApp('shop', settingsViewModel);
    });
    $('#setup-blog').off('click').on('click', function(e) {
        setupApp('blog', settingsViewModel);
    });
    $('#setup-website').off('click').on('click', function(e) {
        setupApp('website', settingsViewModel);
    });

    window.apiPort = window.location.port;

});

//install e-com, website or blog, buttons handle
function setupApp(item, settingsViewModel) {
    $('.loader').addClass('active');
    settingsViewModel.setupApp(item)
        .then(function(result) {
            console.info("--result:", result)
            $('.loader').removeClass('active');
        })
}

//get data for the settings form
function getForm(settingsViewModel) {
    var _this = this
    settingsViewModel.getConfig()
        .then(function(result) {
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
function getPort(settingsViewModel) {
    settingsViewModel.getConfig()
        .then(function(result) {
            $('.js-goto-editors').attr('href', 'http://localhost:' + result.port + '/edit/');
        });
}

//save path and/or port
function saveConfig(serialize) {
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

    settingsViewModel.updateConfig(port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id)
        .then(result => {
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
                emailjsUser_id: result[0].emailjsUser_id
            }); 
        })
}