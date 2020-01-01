var SettingsViewModel = (function () {
    function SettingsViewModel(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    SettingsViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
    };
    SettingsViewModel.inst = function () {
        return new Promise(function (res, rej) {
            if (SettingsViewModel._instance)
                res(SettingsViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                SettingsViewModel._instance = new SettingsViewModel(42);
                SettingsViewModel._instance.setup();
                res(SettingsViewModel._instance);
            });
        });
    };
    SettingsViewModel.prototype.setupApp = function (item) {
        return this.services.setupApp(item);
    };
    SettingsViewModel.prototype.getConfig = function () {
        return this.services.getConfig();
    };
    SettingsViewModel.prototype.updateConfig = function (emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        return this.services.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id);
    };
    return SettingsViewModel;
}());
