class SettingsViewModel {
    constructor(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    setup() {
        this.services = new IntuAPI();
    }
    static inst() {
        return new Promise(function (res, rej) {
            if (SettingsViewModel._instance)
                res(SettingsViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                SettingsViewModel._instance = new SettingsViewModel(42);
                SettingsViewModel._instance.setup();
                res(SettingsViewModel._instance);
            });
        });
    }
    setupApp(item) {
        return this.services.setupApp(item);
    }
    getConfig() {
        return this.services.getConfig();
    }
    updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        return this.services.updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id);
    }
}
