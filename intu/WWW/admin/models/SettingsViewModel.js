var SettingsViewModel = (function () {
    function SettingsViewModel() {
        this.services = new IntuAPI();
    }
    ;
    SettingsViewModel.prototype.setupApp = function (item) {
        return this.services.setupApp(item);
    };
    ;
    SettingsViewModel.prototype.getConfig = function () {
        return this.services.getConfig();
    };
    ;
    SettingsViewModel.prototype.updateConfig = function (port, path, printfulAPI) {
        return this.services.updateConfig(port, path, printfulAPI);
    };
    ;
    return SettingsViewModel;
}());
