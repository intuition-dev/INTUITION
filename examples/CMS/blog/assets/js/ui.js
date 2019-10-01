// header menu links highlight
if ($('[data-js-menu-highlight="about"]').length !== 0) {
    $('header a.about').addClass('active');
} else if ($('[data-js-menu-highlight="blog"]').length !== 0) {
    $('header a.blog').addClass('active');
} else if ($('[data-js-menu-highlight="forum"]').length !== 0) {
    $('header a.forum').addClass('active');
}