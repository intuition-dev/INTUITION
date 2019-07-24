class SettingsViewModel {

    services: any;

    constructor() {
        this.services = new IntuAPI();
    };

    setupApp(item) {
        return this.services.setupApp(item);
    };

    getConfig() {
        return this.services.getConfig();
    };

    updateConfig(port, path, printfulAPI) {
        return this.services.updateConfig(port, path, printfulAPI);
    };
}