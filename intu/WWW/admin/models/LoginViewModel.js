var LoginViewModel = (function () {
    function LoginViewModel() {
        this.services = new IntuAPI();
    }
    ;
    LoginViewModel.prototype.checkAdmin = function (email, pass) {
        return this.services.checkAdmin(email, pass);
    };
    ;
    LoginViewModel.prototype.sendVcode = function (email) {
        return this.services.sendVcode(email);
    };
    ;
    LoginViewModel.prototype.resetPass = function (email, code, pass) {
        return this.services.resetPass(email, code, pass);
    };
    ;
    return LoginViewModel;
}());
