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
depp.define({
    'services2': [
        '/intuAPI/IntuAPI.js'
    ]
});
var AdminViewModel = (function (_super) {
    __extends(AdminViewModel, _super);
    function AdminViewModel(arg) {
        var _this = _super.call(this) || this;
        if (42 !== arg)
            throw new Error('use static inst()');
        return _this;
    }
    AdminViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
    };
    AdminViewModel.inst = function () {
        return new Promise(function (res, rej) {
            if (AdminViewModel._instance)
                res(AdminViewModel._instance);
            depp.require(['httpRPC', 'services2'], function () {
                AdminViewModel._instance = new AdminViewModel(42);
                AdminViewModel._instance.setup();
                res(AdminViewModel._instance);
            });
        });
    };
    AdminViewModel.prototype.getEditorsList = function () {
        return this.services.getEditorsList();
    };
    ;
    AdminViewModel.prototype.editEditor = function (id, name) {
        return this.services.editEditor(id, name);
    };
    ;
    AdminViewModel.prototype.addEditor = function (guid, name, email, password) {
        return this.services.addEditor(guid, name, email, password);
    };
    ;
    AdminViewModel.prototype.deleteEditor = function (id) {
        return this.services.deleteEditor(id);
    };
    ;
    return AdminViewModel;
}(BaseViewModel));
;
