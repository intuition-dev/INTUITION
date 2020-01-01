var LoginViewModel = (function () {
    function LoginViewModel(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
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
        return ans;
    };
    LoginViewModel.prototype.sendVcode = function (email, loginUrl) {
        return this.services.sendVcode(email, loginUrl);
    };
    LoginViewModel.prototype.resetPass = function (email, code, pass) {
        return this.services.resetPass(email, code, pass);
    };
    return LoginViewModel;
}());
