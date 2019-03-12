// header menu links highlight
if ($('[data-js-menu-highlight="about"]').length !== 0) {
    $('header a.about').addClass('active');
} else if ($('[data-js-menu-highlight="blog"]').length !== 0) {
    $('header a.blog').addClass('active');
} else if ($('[data-js-menu-highlight="forum"]').length !== 0) {
    $('header a.forum').addClass('active');
}

$('.js-srch-input').focus(function() {
    $(this).parents('form').find('.srch-btn').addClass('focus');
});

$('.js-srch-input').focusout(function() {
    $(this).parents('form').find('.srch-btn').removeClass('focus');
});