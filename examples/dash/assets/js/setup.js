
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

onDeppLoaded()

function onDeppLoaded() {
   depp.define({
      'pre': [
         ROOT + 'assets/css/gridform.css'
         , '/assets/js/jquery.disableAutoFill.js'
      ],
      'css': [
         ROOT + 'assets/css/spectre.css'
         , ROOT + 'assets/css/nav.css'
         , ROOT + 'assets/css/main.css'
         , 'css!https://fonts.googleapis.com/css?family=Open+Sans'
      ],
      'chartjs': [
         'https://cdn.jsdelivr.net/npm/chart.js@2.7.3/dist/Chart.min.js'
      ],
      'c3': [
         'https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.8/c3.min.css',
         'https://cdnjs.cloudflare.com/ajax/libs/d3/5.7.0/d3.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/c3/0.6.8/c3.min.js'
      ],
      'nvd3': [
         'https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.css',
         'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js',
         'https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.8.6/nv.d3.min.js'
      ],
      'loadModel': [
         ROOT + 'assets/models/OneModel.js'
      ],
      'loadChartjsBind': [
         ROOT + 'screen/chartjs/ChartjsBind.js'
      ],
      'loadC3Bind': [
         ROOT + 'screen/chartjs/C3Bind.js'
      ],
      'loadNvd3Bind': [
         ROOT + 'screen/chartjs/Nvd3Bind.js'
      ]
   })//define
   depp.require(['pre'], setup)
}


function onDeviceReady() { // nothing will work before this
   console.log('deviceready!')
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

   console.log('style done', Date.now() - _start)
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
addEventListener('bla', function(evt) {
   console.log(evt.detail)
})
