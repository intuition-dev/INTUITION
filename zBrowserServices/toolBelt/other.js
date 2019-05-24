
// other stuff to keep toolBelt clean/small
// this file is not provided as min.

console.log('lang', getLang())

depp.define({

    'Noto-Sans'      : 'css!//fonts.googleapis.com/css?family=Noto+Sans'
   ,'PacificoFont': 'css!//fonts.googleapis.com/css?family=Pacifico'
   ,'PoppinsFont' : 'css!//fonts.googleapis.com/css?family=Poppins'

   //removes FOUT
   ,'fontloader':'//cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js'

   //for AMP
   ,'mustache': ['//cdn.jsdelivr.net/npm/mustache@3.0.1/mustache.min.js']

   //dates:
   ,'js-joda'  : '//cdn.jsdelivr.net/npm/js-joda@1.10.1/dist/js-joda.min.js'

   //fts
   ,'lunr':'//cdn.jsdelivr.net/npm/lunr@2.3.6/lunr.min.js'
   ,'wade':'//unpkg.com/wade@0.3.3/dist/wade.min.js'

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
 