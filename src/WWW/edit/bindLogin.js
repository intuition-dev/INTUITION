/**
    Editor reset password
**/
class BindLogin {
    constructor() {
        this.editViewModel = new LoginViewModel();
    }

    sendVcode(email) {
        if (email !== '') {
            this.editViewModel.sendVcodEditor(email)
                .then(function(result) {
                    console.info("--result:", result);
                });
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.editViewModel.resetPassEditor(email, code, pass)
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
                });
        }
    }

    checkUser(formLogin, formPassw) {
		this.editViewModel.checkEditor(formLogin, formPassw)
			.then(function (result) {
				if (result) {
					window.sessionStorage.setItem('username', formLogin);
					window.sessionStorage.setItem('password', formPassw);

					let hash = location.hash;
					window.location.replace('/edit/edit/' + hash);

				} else {
					window.location = '/edit'
				}
			})
    }
    
}