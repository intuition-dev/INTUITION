depp.require('scripts', function() {

    // login form input lables animation
    if ($('input[name="login"]:-webkit-autofill').length > 0) {
        $('input[name="login"]').parents('.input-wrap').find('label').addClass('focus');
    }
    if ($('input[name="password"]:-webkit-autofill').length > 0) {
        $('input[name="password"]').parents('.input-wrap').find('label').addClass('focus');
    }

    $('.login-form input').focus(function() {
        var label = $(this).parents('.input-wrap').find('label');
        if ($(this).val() === '') {
            label.addClass('focus');
        }
    });

    $('.login-form input').focusout(function() {
        var label = $(this).parents('.input-wrap').find('label');
        if ($(this).val() === '') {
            label.removeClass('focus');
        }
    });


    $('.user-name').text(sessionStorage.getItem('user_name'));

    $('.datepicker').Zebra_DatePicker();

    $('.site-brand').text(siteName);

    // redirect on not logged in user
    let sesName = sessionStorage['username'];
    let sesPass = sessionStorage['password'];

    if (typeof sesName === 'undefined'
        || sesName === ''
        || sesName === null
        || typeof sesPass === 'undefined'
        || sesPass === ''
        || sesPass === null) {

            if (window.location.pathname !== '/edit' && window.location.pathname !== '/edit/') {
                console.info('User is not logged in, redirecting to login page ...');
                window.location.replace('/edit')
            }

    }

});
