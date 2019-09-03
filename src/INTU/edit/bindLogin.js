/**
    Editor reset password
**/

depp.define({
    'loginViewModel': [
        '/edit/models/LoginViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('loginViewModel');

depp.require(['ui', 'scripts', 'loginViewModel'], async function () {
    
    var loginViewModel = await LoginViewModel.inst();

    /*
    * editor user login
    */
    $(document).on('submit', '#login-form', function (e) {

        e.preventDefault();
        let formLogin = $("#login-form input[name='login']").val();
        let formPassw = $("#login-form input[name='password']").val();
        checkUser(formLogin, formPassw, loginViewModel);

    });

    /*
    * editor password reset
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
        $('.v-code').html('Verification code was sent to ' + resetEmail);
        sendVcode(resetEmail, loginViewModel);
    });

    let url = new URL(location.href);
    let urlEmail = url.searchParams.get("email");

    if (urlEmail !== null && urlEmail !== '') {

        $('#login-form, #btn-login, [data="reset-password"]').addClass('d-hide');
        $("[name='reset-pass-form-2']").removeClass('d-hide');
        $('.v-code').html('Verification code was sent to ' + urlEmail);
        sendVcode(urlEmail, loginViewModel);

        $(document).on('submit', '[name="reset-pass-form-2"]', function (e) {
            e.preventDefault();
            $("[name='reset-pass-form-2']").addClass('d-hide');
            let password = $("[name='new-password']").val();
            let vCode = $("[name='v-code']").val();
            resetPass(urlEmail, vCode, password, loginViewModel);
        });

    } else {

        $(document).on('submit', '[name="reset-pass-form-2"]', function (e) {
            e.preventDefault();
            $("[name='reset-pass-form-2']").addClass('d-hide');
            let password = $("[name='new-password']").val();
            let vCode = $("[name='v-code']").val();
            resetPass(resetEmail, vCode, password, loginViewModel);
        });

    }
            
});


function sendVcode(email, loginViewModel) {
    if (email !== '') {
        loginViewModel.sendVcodEditor(email)
            .then(function(result) {
                console.info("--result:", result);
            });
    }
}

function resetPass(email, code, pass, loginViewModel) {
    if (email !== '' && pass !== '' && code !== '') {
        loginViewModel.resetPassEditor(email, code, pass)
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

function checkUser(formLogin, formPassw, loginViewModel) {
    loginViewModel.checkEditor(formLogin, formPassw)
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