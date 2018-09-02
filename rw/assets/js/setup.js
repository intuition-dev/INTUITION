
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
   'https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.6/dist/_js/js-offcanvas.pkgd.js'
   , 'https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.6/dist/_css/prefixed/js-offcanvas.css'

   , ROOT + 'assets/css/gridform.css'

   , 'https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css'
   , 'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js'
   , 'https://cdn.datatables.net/fixedheader/3.1.5/css/fixedHeader.dataTables.min.css'
   , 'https://cdn.datatables.net/select/1.2.7/css/select.dataTables.min.css'

   , 'https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js'
   , 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.19.0/js/load-image.all.min.js'
   , 'https://cdn.jsdelivr.net/npm/is_js@0.9.0/is.min.js'

   , ROOT + 'assets/js/jquery.disableAutoFill.js'

], 'cssJs')

function onDeviceReady() { // nothing will work before this
   console.log('deviceready!')
   loadjs.done('device')
}

function cssLoaded() {// called by the style sheet in layout
   loadjs.done('css')
}

loadjs.ready(['css', 'device', 'cssJs'], function () {
   loadjs([
      'https://cdn.datatables.net/select/1.2.7/js/dataTables.select.min.js'
      ,'https://cdn.datatables.net/fixedheader/3.1.5/js/dataTables.fixedHeader.min.js'
   ], 'style')//loaded
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
setInterval(function () {
   if (_scSz) {
      _scSz = false
      userSzSc()
   }
}, 150)

// usage: ////////////////////////////////////////////////////////////////////
loadjs.ready(['style'], function () {// 'show' page, ex: unhide
   setupUserSzSc()

   $('#navOpen').offcanvas({
      triggerButton: '#off-cbut' // btn to open offcanvas
   })
   let offcanvas = $('#navOpen').data('offcanvas-component')
   $('#off-cbut').click(function () {
      console.log('#offItems')
      offcanvas.open()
   })
   $('#navOpen').click(function () {
      console.log('#navOpen')
      offcanvas.close()
   })

   $('.delayShowing').removeClass('delayShowing') // show

   //loadjs(ROOT + 'assets/router/spa-router.js')

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
