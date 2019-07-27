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
var LoginViewModel = (function (_super) {
    __extends(LoginViewModel, _super);
    function LoginViewModel() {
        var _this = _super.call(this) || this;
        _this.services = new IntuAPI();
        return _this;
    }
    ;
    LoginViewModel.prototype.sendVcodEditor = function (email) {
        return this.services.sendVcodEditor(email);
    };
    ;
    LoginViewModel.prototype.resetPassEditor = function (email, code, pass) {
        return this.services.resetPassEditor(email, code, pass);
    };
    ;
    LoginViewModel.prototype.checkEditor = function (formLogin, formPassw) {
        return this.services.checkEditor(formLogin, formPassw);
    };
    ;
    return LoginViewModel;
}(BaseViewModel));
