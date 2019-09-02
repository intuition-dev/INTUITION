/**
    Admin login
**/

depp.require(['poly'], onPoly);

depp.define({
    'loginViewModel': [
        '/admin/models/LoginViewModel.js'
    ],
});

function onPoly() {
    depp.require('loginViewModel');
};

depp.require(['rw', '#scripts', 'loginViewModel'], async function () {
    
    var loginViewModel = await LoginViewModel.inst();

    /*
    * admin login
    */
    $(document).on('click', '#btn-login', function (ev) {
        ev.preventDefault()
        let formLogin = $("#login-form input[name='login']").val();
        let formPassw = $("#login-form input[name='password']").val();
        login(formLogin, formPassw, loginViewModel);
    });

    /*
    * admin password reset
    */
    $(document).on('click', '[data="reset-password"]', function (e) {
        e.preventDefault();
        $('#login-form, #btn-login, [data="reset-password"]').addClass('d-hide');
        $("[name='reset-pass-form']").removeClass('d-hide');
    });

    $(document).on('submit', '[name="reset-pass-form"]', function (e) {
        e.preventDefault();
        $("[name='reset-pass-form']").addClass('d-hide');
        $("[name='reset-pass-form-2']").removeClass('d-hide');
        window.resetEmail = $("[name='reset-password-email']").val();
        let loginUrl = window.location.href;
        $('.v-code').html('Verification code was sent to ' + resetEmail);
        sendVcode(resetEmail, loginUrl, loginViewModel);
    });

    $(document).on('submit', '[name="reset-pass-form-2"]', function (e) {
        e.preventDefault();
        $("[name='reset-pass-form-2']").addClass('d-hide');
        let password = $("[name='new-password']").val();
        let vCode = $("[name='v-code']").val();
        resetPass(resetEmail, vCode, password, loginViewModel);
    });

    // show form to enter code
    var hash = window.location.hash.substring(1);
    if(hash === 'code') {
        $('#login-form, #btn-login, [data="reset-password"]').addClass('d-hide');
        $("[name='reset-pass-form-2']").removeClass('d-hide');
    }

});


function login(email, pass, loginViewModel) {
    loginViewModel.checkAdmin(email, pass)
        .then(function(result) {
            console.info("--result:", result)
            if (result) {
                window.sessionStorage.setItem('username', email);
                window.sessionStorage.setItem('password', pass);

                window.location = '/admin/settings';
            } else {
                console.info('admin auth fail');
                window.location = '/admin'
            }
        })
}

function signOut() {
    sessionStorage.removeItem('username');
    console.info("--sessionStorage:", sessionStorage)
    sessionStorage.removeItem('password');
    if (window.location.pathname !== '' && window.location.pathname !== '/admin') {
        window.location.replace('/admin');
    }
}

function sendVcode(email, loginUrl, loginViewModel) {
    if (email !== '') {
        loginViewModel.sendVcode(email, loginUrl)
            .then(function(result) {
                console.info("--result:", result);
            });
    }
}

function resetPass(email, code, pass, loginViewModel) {
    if (email !== '' && pass !== '' && code !== '') {
        loginViewModel.resetPass(email, code, pass)
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
                console.info("--result:", result);
            })
    }
}