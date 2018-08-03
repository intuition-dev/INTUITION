
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
   //,'//cdn.jsdelivr.net/npm/intersection-observer@0.5.0/intersection-observer.js'
   'https://unpkg.com/vivid-icons@1.0.3/dist/vivid-icons.min.js'
   , 'https://unpkg.com/js-offcanvas/dist/_js/js-offcanvas.pkgd.min.js'
   , 'https://unpkg.com/js-offcanvas/dist/_css/prefixed/js-offcanvas.css'
   , ROOT + '/assets/css/gridforms/gridforms.css'

   , 'https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'
   , 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.19.0/js/load-image.all.min.js'
   , 'https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js'

   , 'https://cdn.rawgit.com/terrylinooo/jquery.disableAutoFill/92cb6f86/src/jquery.disableAutoFill.js'

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


function supportsIntersectionObserver() {
   return (
     'IntersectionObserver' in global &&
     'IntersectionObserverEntry' in global &&
     'intersectionRatio' in IntersectionObserverEntry.prototype
   )
 }

// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['style'], function () {// 'show' page, ex: unhide

   $('#off-canvas').offcanvas({
      triggerButton: '#off-cbut' // btn to open offcanvas
   })
   let offcanvas = $('#off-canvas').data('offcanvas-component')
   $('#offItems').click(function () {
      console.log('#offItems')
      offcanvas.close()
   })
   $('.delayShowing').removeClass('delayShowing') // show

   //loadjs(ROOT + '/assets/router/spa-router.js')

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
