
window.isphone = false
if (document.URL.indexOf("http://") === -1
   && document.URL.indexOf("https://") === -1) {
   window.isphone = true
}

console.info('phonegap?', window.isphone)
if (window.isphone) { // //file is a browser
   document.addEventListener("deviceready", onDeviceReady, false)
} else {
   document.addEventListener("DOMContentLoaded", onDeviceReady, false)
}
function onDeviceReady() {
   console.info('deviceready')
   depp.done('deviceready')
}


depp.define({
   'pre': [
      '//cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.slim.min.js'

      , '//cdn.jsdelivr.net/npm/js-offcanvas@1.2.8/dist/_js/js-offcanvas.pkgd.js'
      , '//cdn.jsdelivr.net/npm/js-offcanvas@1.2.8/dist/_css/prefixed/js-offcanvas.css'

      , ROOT + 'assets/css/gridform.css'
      , ROOT + 'assets/3rd/collections.min.js'
   ]

   , 'tabLoaded': ['#pre'
      , '//cdn.jsdelivr.net/npm/validator@10.9.0/validator.min.js'
      , '//cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.css'
      , '//cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.min.js'

      , ROOT + 'assets/3rd/jquery.disableAutoFill.js'

      , '//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/js/tabulator.min.js'
      , '//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/css/tabulator.min.css'
      , '//cdn.jsdelivr.net/npm/tabulator-tables@4.2.3/dist/css/tabulator_simple.min.css'
   ]

   , 'css': ['#tabLoaded'
      , ROOT + 'assets/css/spectre.css'
      , ROOT + 'assets/css/nav.css'
      , ROOT + 'assets/css/main.css'
      , 'css!//fonts.googleapis.com/css?family=Open+Sans:400,600'
   ]
})//define

depp.require(['pre', 'deviceready'], onLoaded)

// ////////////////////////////////////////////////////////////////////]\
function onLoaded() {
   depp.require(['css']) // fetch the rest, but don't wait on it

   $('#navOpen').offcanvas({
      triggerButton: '#off-cbut' // btn to open offcanvas
   })
   let offcanvas = $('#navOpen').data('offcanvas-component')
   $('#off-cbut').click(function () {
      console.info('#offItems')
      offcanvas.open()
   })
   $('#navOpen').click(function () {
      console.info('#navOpen')
      offcanvas.close()
   })

   $('.delayShowing').removeClass('delayShowing') // show

   depp.done('onLoaded')
   console.info('onLoaded done', Date.now() - _start)
   bAuth = new BaseAuth()

}//onLoaded

var bAuth

// util: /////////////////////////////////////////////////////////////////////
class BaseAuth {
   constructor() {
      const THIZ = this
      auth.onAuthStateChanged(function (user_) {
         if (THIZ.isUserIn()) {
            console.info('CRUDauth', true);
         }
         else {
            console.info('CRUDauth', 'bye');
         }
      });
   }
   sendEmailVerification() {
      if (!this.isUserIn()) {
         console.info('sending', auth.currentUser);
         auth.currentUser.sendEmailVerification();
      }
      else
         console.info('no currentUser');
   }
   isUserIn() {
      if (!auth.currentUser)
         return false;
      return auth.currentUser.emailVerified;
   }
}

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


