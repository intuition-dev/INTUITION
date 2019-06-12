depp.define({
        'pre': [
            '#jquery',
            '#RPC'
        ],
        'css': ['#pre', 'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700', '/assets/css/style.css'],
        'snipcart': [
            "//cdn.snipcart.com/themes/2.0/base/snipcart.min.css"
        ],
        //   'shop-item': [
        //       '#snipLoaded',
        //   ]
    }) //define

depp.require(['DOM', 'pre', 'snipcart'], onLoaded) //d2

loadSnipCart('MjAwOGYyNjAtYTJiOS00ZjgzLThjYmYtYzFjYjY5NDAwYjcxNjM2OTE4MzUyMzc4NzIxNjYx')
    .then(function(res) {
        depp.done('shop-item')
    })

function onLoaded() {
    mobileMenu()
    depp.require(['css'], function() {
        console.info('css')
        $('.delayShowing').removeClass('delayShowing') // show
        $('body.blur').removeClass('blur') // show
    })

    addEventListener('onBrowser', function(evt) {
        console.info("--$(window).width():", $(window).width())
        mobileMenu()
    });
}

///Mobile menu
function mobileMenu() {
    console.info("--$('.navbar').innerWidth():", $('.navbar').innerWidth())
    if ($('.navbar').innerWidth() < 900) {
        $('[data-js="movile-nav"]').addClass('mobile');

        $('.nav-collapse').off('click').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('mobileNavToggle');
            $(this).find('#nav-icon').toggleClass('open');
            $('.navbar-section.mobile').toggleClass('open');
        });

        $('.navbar-section.mobile').off('click').on('click', function() {
            $(this).toggleClass('open');
            $('.nav-collapse').toggleClass('mobileNavToggle');
            $('.nav-collapse').find('#nav-icon').toggleClass('open');
        })
    } else {
        $('[data-js="movile-nav"]').removeClass('mobile');
        $('.nav-collapse').removeClass('mobileNavToggle');
        $('#nav-icon').removeClass('open');
    }
}