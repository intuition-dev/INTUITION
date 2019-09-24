declare var depp: any;

class LoginViewModel extends BaseViewModel {

    services: any;

    constructor(arg) {
        super()
        if (42 !== arg) throw new Error('use static inst()') // guard!
    }

    setup() {
        this.services = new IntuAPI();
    }

    static _instance: LoginViewModel
    static inst(): Promise<LoginViewModel> {
        return new Promise(function (res, rej) {

            if (LoginViewModel._instance) res(LoginViewModel._instance)

            depp.require(['httpRPC', 'intuAPI'], function () {
                LoginViewModel._instance = new LoginViewModel(42);
                LoginViewModel._instance.setup();
                res(LoginViewModel._instance);
            });
        });
    }


    sendVcodEditor(email) {
        return this.services.sendVcodEditor(email);
    };

    resetPassEditor(email, code, pass) {
        return this.services.resetPassEditor(email, code, pass);
    };

    checkEditor(formLogin, formPassw) {
        return this.services.checkEditor(formLogin, formPassw);
    };

}