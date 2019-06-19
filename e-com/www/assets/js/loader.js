depp.define({
        'pre': [
            '#jquery',
            '#RPC'
        ],
        'css': ['#pre', 'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700', '/assets/css/style.css'],
        'snipcart': [
            ROOT + 'assets/js/ui.js',
            "//cdn.snipcart.com/themes/2.0/base/snipcart.min.css"
        ],
    }) //define

depp.require(['DOM', 'pre', 'snipcart'], onLoaded) //d2

loadSnipCart(SNIPCART_API)
    .then(function(res) {
        depp.done('shop-item')

        depp.require(['snipcart'], function() {
            snipCartRelatedStuff()
        })

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