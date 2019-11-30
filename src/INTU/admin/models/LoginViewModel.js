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
    function LoginViewModel(arg) {
        var _this = _super.call(this) || this;
        if (42 !== arg)
            throw new Error('use static inst()');
        return _this;
    }
    LoginViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
    };
    LoginViewModel.inst = function () {
        return new Promise(function (res, rej) {
            if (LoginViewModel._instance)
                res(LoginViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                LoginViewModel._instance = new LoginViewModel(42);
                LoginViewModel._instance.setup();
                res(LoginViewModel._instance);
            });
        });
    };
    LoginViewModel.prototype.checkAdmin = function (email, pass) {
        console.log(pass);
        var ans = this.services.checkAdmin(email, pass);
        console.log(ans);
        return ans;
    };
    LoginViewModel.prototype.sendVcode = function (email, loginUrl) {
        return this.services.sendVcode(email, loginUrl);
    };
    LoginViewModel.prototype.resetPass = function (email, code, pass) {
        return this.services.resetPass(email, code, pass);
    };
    return LoginViewModel;
}(BaseViewModel));
