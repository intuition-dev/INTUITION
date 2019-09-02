var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SettingsViewModel = (function (_super) {
    __extends(SettingsViewModel, _super);
    function SettingsViewModel(arg) {
        var _this = _super.call(this) || this;
        if (42 !== arg)
            throw new Error('use static inst()');
        return _this;
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
    SettingsViewModel.prototype.updateConfig = function (port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        return this.services.updateConfig(port, path, emailjsService_id, emailjsTemplate_id, emailjsUser_id);
    };
    return SettingsViewModel;
}(BaseViewModel));
