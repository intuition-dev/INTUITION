
$(document).ready(function () {
    // are we running in native app or in a browser?
    window.isphone = false
    if (document.URL.indexOf("http://") === -1
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true
    }

    console.log('phonegap?', window.isphone)
    if (window.isphone) { // //file is a browser
        document.addEventListener("deviceready", onDeviceReady, false)
    } else {
        onDeviceReady()
    }
})

loadjs([
    //'https://cdn.jsdelivr.net/npm/signals@1.0.0/dist/signals.min.js'

   'https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.8/dist/_js/js-offcanvas.pkgd.js'
   , 'https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.8/dist/_css/prefixed/js-offcanvas.css'

   , 'https://cdn.jsdelivr.net/npm/fuse.js@3.3.0/dist/fuse.min.js'
   , ROOT + 'assets/css/gridform.css'
//, ROOT + 'assets/js/lorem.js'

   //, 'https://cdn.jsdelivr.net/npm/handlebars@4.0.11/dist/handlebars.min.js'
   , 'https://cdn.jsdelivr.net/npm/paginationjs@2.1.4/dist/pagination.min.js'
   , 'https://cdn.jsdelivr.net/npm/paginationjs@2.1.4/dist/pagination.css'

   , 'https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'
   , 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.19.0/js/load-image.all.min.js'
   , 'https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js'
   , '/assets/js/jquery.disableAutoFill.js'

], 'cssJs')

function onDeviceReady() { // nothing will work before this
    console.log('deviceready!')
    loadjs.done('device')
}

function cssLoaded() {// called by the style sheet in layout
    loadjs.done('css')
}

loadjs.ready(['css', 'device', 'cssJs'], function () {
    loadjs.done('style')
})

let _scSz = true
function setupUserSzSc() {
    $(window).scroll(function () {
        _scSz = true
    })
    $(window).resize(function () {
        _scSz = true
    })
}//()

// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['style'], function () {// 'show' page, ex: unhide
    setupUserSzSc()

    $('.delayShowing').removeClass('delayShowing') // show

    setInterval(function () {
        if (_scSz) {
            _scSz = false
            if (typeof userSzSc !== "undefined") userSzSc()
        }
    }, 150)

    console.log('style done', Date.now() - _start)
})//ready

// util: /////////////////////////////////////////////////////////////////////
function getUrlVars() {
    var vars = [], hash
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=')
        vars.push(hash[0])
        vars[hash[0]] = hash[1]
    }
    return vars
}

function inView(el) { // is element in viewport
    //special bonus for jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    )
}
