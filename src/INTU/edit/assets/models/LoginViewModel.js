class LoginViewModel {
    constructor(arg) {
        if (42 !== arg)
            throw new Error('use static inst()'); // guard!
    }
    setup() {
        this.services = new IntuAPI();
        this.services.DEBUG = true;
    }
    static inst() {
        return new Promise(function (res, rej) {
            if (LoginViewModel._instance)
                res(LoginViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                LoginViewModel._instance = new LoginViewModel(42);
                LoginViewModel._instance.setup();
                res(LoginViewModel._instance);
            });
        });
    }
    checkEditor(formLogin, formPassw) {
        return this.services.checkEditor(formLogin, formPassw);
    }
    ;
    sendVcodEditor(email) {
        return this.services.sendVcodEditor(email);
    }
    ;
    resetPassEditor(email, code, pass) {
        return this.services.resetPassEditor(email, code, pass);
    }
    ;
}
