var LoginViewModel = (function () {
    function LoginViewModel() {
    }
    LoginViewModel.prototype.login = function (email, pswd) {
        return null;
    };
    LoginViewModel.prototype._save = function (email, pswd) {
        sessionStorage.set('user', email);
        sessionStorage.set('pswd', pswd);
    };
    return LoginViewModel;
}());
