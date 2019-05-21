
// other stuff to keep toolBelt clean/small
// this file is not provided as min.

console.log('lang', getLang())

depp.define({

    'Noto-Sans'      : 'css!//fonts.googleapis.com/css?family=Noto+Sans'
   ,'PacificoFont': 'css!//fonts.googleapis.com/css?family=Pacifico'
   ,'PoppinsFont' : 'css!//fonts.googleapis.com/css?family=Poppins'

   ,'reframe'     :['//cdn.jsdelivr.net/npm/reframe.js@2.2.5/dist/reframe.min.js', '#DOM']
   ,'backstretchJQ':['#jquery','//cdn.jsdelivr.net/npm/jquery-backstretch@2.1.17/jquery.backstretch.min.js']
   ,'vintage'   :'//cdn.jsdelivr.net/npm/vintagejs@2.2.0/dist/vintage.min.js'

})


/* how to load tricky things
   loadQunit().then(function(){
      console.log('qunit-ready')
   })

   loadFB().then(function(){
      console.log('FB')
   })
*/


// use Custom Events example:
addEventListener('onBrowser', function (evt) {
   console.log(evt.detail)
 })
 
 // just an example that loads some frequently needed libs
 depp.require('DOM', function() {
    setTimeout(function () {
       depp.require(['isJs', 'OpenSans', 'feather-icons'], function () {
         if (is.ie()) console.log('ie')
         if (is.mobile()) console.log('mobile')
         if (is.touchDevice()) console.log('touch')
       })
    }, 5*1000)    
 })
 // $('.delayShowing').removeClass('delayShowing') // show
 