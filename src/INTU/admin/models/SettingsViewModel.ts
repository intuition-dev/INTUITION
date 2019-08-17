

class SettingsViewModel extends BaseViewModel {

    services: any;

    constructor() {
        super()
        this.services = new IntuAPI();
    }

    setupApp(item) {
        return this.services.setupApp(item);
    }

    getConfig() {
        return this.services.getConfig();
    }

    updateConfig(port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        return this.services.updateConfig(port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id);
    }
    
}//class