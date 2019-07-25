
class LoginViewModel extends BaseViewModel {

    services: any;

    constructor() {
        super()
        this.services = new IntuAPI();
    }

    checkAdmin(email, pass) {
        return this.services.checkAdmin(email, pass);
    }

    sendVcode(email, loginUrl) {
        return this.services.sendVcode(email, loginUrl);
    }

    resetPass(email, code, pass) {
        return this.services.resetPass(email, code, pass);
    }
}