

class LoginViewModel extends BaseViewModel  {

    services: any;

    constructor() {
        super()
        this.services = new IntuAPI();
    };  

    sendVcodEditor(email) {
        return this.services.sendVcodEditor(email);
    };

    resetPassEditor(email, code, pass){
        return this.services.resetPassEditor(email, code, pass);
    };

    checkEditor(formLogin, formPassw) {
        return this.services.checkEditor(formLogin, formPassw);
    };

}