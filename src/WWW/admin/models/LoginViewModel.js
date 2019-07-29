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
    LoginViewModel.prototype.checkAdmin = function (email, pass) {
        return this.services.checkAdmin(email, pass);
    };
    LoginViewModel.prototype.sendVcode = function (email, loginUrl) {
        return this.services.sendVcode(email, loginUrl);
    };
    LoginViewModel.prototype.resetPass = function (email, code, pass) {
        return this.services.resetPass(email, code, pass);
    };
    return LoginViewModel;
}(BaseViewModel));
