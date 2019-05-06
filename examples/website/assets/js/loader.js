
document.addEventListener("DOMContentLoaded", onDeviceReady, false)

function onDeviceReady() {
   console.info('deviceready')
   depp.done('deviceready')
}

depp.define({
   'pre': [
      '//cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.slim.min.js'
      , '//cdn.jsdelivr.net/npm/slick-carousel@1.8.0/slick/slick.min.js'
      , '//cdn.jsdelivr.net/npm/slick-carousel@1.8.0/slick/slick.css'
      , '//cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'

   ]
})//define

depp.define({
   '2nd': ['#pre'
      , '//cdn.emailjs.com/sdk/2.2.4/email.min.js'
      , '/assets/3rd/jquery.disableAutoFill.js'
      , '//cdn.jsdelivr.net/npm/validator@10.9.0/validator.min.js'
      , '//cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.css'
      , '//cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.min.js'

   ]
})//define

depp.define({
   'css': ['#2nd'
      , '/assets/css/spectre.css'
      , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600'
      , 'css!//fonts.googleapis.com/css?family=Oswald'//headings
   ]
})//define

depp.require(['pre', 'deviceready'], onLoaded) //d2

var _scSz = true
function setupUserSzSc() {
   $(window).scroll(function () {
      _scSz = true
   })
   $(window).resize(function () {
      _scSz = true
   })
}//()

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

// usage: ////////////////////////////////////////////////////////////////////
function onLoaded() {// 'show' page, ex: unhide
   setupUserSzSc()
   depp.require(['css'], function () {
      console.info('css')
      $('.delayShowing').removeClass('delayShowing') // show
   })

   console.info('setup zen')
   zenscroll.setup(null, 0)


   setInterval(function () {
      if (_scSz) {
         _scSz = false
         userSzSc()
      }
   }, 150)
   //loadjs(ROOT + 'assets/router/spa-router.js')
   depp.done('onLoaded')
   console.info('onLoaded done', Date.now() - _start)

}//onLoaded
