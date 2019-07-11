
$(document).ready(function () {
   // are we running in native app or in a browser?
   window.isphone = false
   if (document.URL.indexOf("http://") === -1
      && document.URL.indexOf("https://") === -1) {
      window.isphone = true
   }

   console.info('phonegap?', window.isphone)
   if (window.isphone) { // //file is a browser
      document.addEventListener("deviceready", onDeviceReady, false)
   } else {
      onDeviceReady()
   }
})

onDeppLoaded()

function onDeppLoaded() {
   depp.define({
      'pre': [
         '/assets/css/gridform.css',
         '/assets/3rd/jquery.disableAutoFill.js',
         '/assets/3rd/collections.js'
      ],
      'css': [
         '/assets/css/spectre.css'
         , '/assets/css/nav.css'
         , '/assets/css/main.css'
         , 'css!//fonts.googleapis.com/css?family=Open+Sans'
      ],
      'vega': [
         '//cdn.jsdelivr.net/npm/vega@4',
         '//cdn.jsdelivr.net/npm/vega-embed@3'
      ]
   })//define
   depp.require(['pre'], setup)
}


function onDeviceReady() { // nothing will work before this
   console.info('deviceready!')
}

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
function setup() {
   depp.require(['css'])

   setupUserSzSc()

   console.info('style done', Date.now() - _start)
   $('.delayShowing').removeClass('delayShowing') // show
}//ready

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

function disE(evtName, msg) {
   dispatchEvent(new CustomEvent(evtName, { detail: msg }))
}
// eg
addEventListener('bla', function (evt) {
   console.info(evt.detail)
})
