/**
    Admin login
**/
class BindLogin {
    constructor() {
        this.IntuAPI = new IntuAPI()
    }
    login(email, pass) {
        this.IntuAPI.checkAdmin(email, pass)
            .then(function(result) {
                console.info("--result:", result)
                if (result) {
                    window.sessionStorage.setItem('username', email);
                    window.sessionStorage.setItem('password', pass);

                    window.location = '/admin/settings';
                } else {
                    window.location = '/admin'
                }
            })
    }
    signOut() {
        sessionStorage.removeItem('username');
        console.info("--sessionStorage:", sessionStorage)
        sessionStorage.removeItem('password');
        if (window.location.pathname !== '' && window.location.pathname !== '/admin') {
            window.location.replace('/admin');
        }
    }

    sendVcode(email) {
        if (email !== '') {
            this.IntuAPI.sendVcode(email)
                .then(function(result) {
                    console.info("--result:", result)
                })
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.IntuAPI.resetPass(email, code, pass)
                .then(function(result) {
                    if (result) {
                        $('.js-pass-changed-notification').removeClass('d-hide');
                        setTimeout(function() {
                            $('.js-pass-changed-notification').addClass('d-hide');
                            $('.js-login-form, .js-btn-login, [data="reset-password"]').removeClass('d-hide');
                        }, 4000);
                    } else {
                        $('.js-pass-changed-notification-err').removeClass('d-hide');
                    }
                    console.info("--result:", result)
                })
        }
    }
}