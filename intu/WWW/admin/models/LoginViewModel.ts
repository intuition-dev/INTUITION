
class LoginViewModel {

    services: any;

    constructor() {
        this.services = new IntuAPI();
    };

    checkAdmin(email, pass) {
        return this.services.checkAdmin(email, pass);
    };

    sendVcode(email) {
        return this.services.sendVcode(email);
    };

    resetPass(email, code, pass) {
        return this.services.resetPass(email, code, pass);
    };
}