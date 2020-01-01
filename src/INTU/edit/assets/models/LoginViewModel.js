var LoginViewModel = (function () {
    function LoginViewModel(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    LoginViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
        this.services.DEBUG = true;
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
    LoginViewModel.prototype.checkEditor = function (formLogin, formPassw) {
        return this.services.checkEditor(formLogin, formPassw);
    };
    ;
    LoginViewModel.prototype.sendVcodEditor = function (email) {
        return this.services.sendVcodEditor(email);
    };
    ;
    LoginViewModel.prototype.resetPassEditor = function (email, code, pass) {
        return this.services.resetPassEditor(email, code, pass);
    };
    ;
    return LoginViewModel;
}());
