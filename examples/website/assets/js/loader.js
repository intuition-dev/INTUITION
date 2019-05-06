function onDeviceReady() {
   console.info('deviceready')
   depp.done('deviceready')
}

depp.define({
   'css': [
      '#zenscroll'
      , '#jquery'
      , '#disableAutoFill'
      , '#validator'
      , '#sweetAlert'
      , '/assets/css/spectre.css'
      , '#OpenSans'
      , '#OswaldFont'//headings
   ]
})//define

depp.require(['zenscroll', 'jquery', 'deviceready'], onLoaded) //d2

var _scSz = true
function setupUserSzSc() {
   $(window).scroll(function () {
      _scSz = true
   })
   $(window).resize(function () {
      _scSz = true
   })
}//()

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