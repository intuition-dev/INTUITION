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
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoginViewModel.prototype.login = function (email, pswd) {
        return null;
    };
    LoginViewModel.prototype._save = function (email, pswd) {
        sessionStorage.set('user', email);
        sessionStorage.set('pswd', pswd);
    };
    LoginViewModel.prototype.sendPswdReset = function (email) {
    };
    LoginViewModel.prototype.checkCode = function (pswd, code) {
    };
    return LoginViewModel;
}(BaseViewModel));
