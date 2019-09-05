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
var SetupViewModel = (function (_super) {
    __extends(SetupViewModel, _super);
    function SetupViewModel(arg) {
        var _this = _super.call(this) || this;
        if (42 !== arg)
            throw new Error('use static inst()');
        return _this;
    }
    SetupViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
    };
    SetupViewModel.inst = function () {
        return new Promise(function (res, rej) {
            if (SetupViewModel._instance)
                res(SetupViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                SetupViewModel._instance = new SetupViewModel(42);
                SetupViewModel._instance.setup();
                res(SetupViewModel._instance);
            });
        });
    };
    SetupViewModel.prototype.createConfig = function (form) {
        return this.services.createConfig(form);
    };
    SetupViewModel.prototype.deleteTable = function () {
        this.services.deleteTables();
    };
    return SetupViewModel;
}(BaseViewModel));
