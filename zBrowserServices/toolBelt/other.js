
// other stuff to keep toolBelt clean/small
// this file is not provided as min.

console.log('lang', getLang())

// https://webkit.org/status

depp.define({
    'Noto-Sans'      : 'css!//fonts.googleapis.com/css?family=Noto+Sans'
   ,'PacificoFont': 'css!//fonts.googleapis.com/css?family=Pacifico'
   ,'PoppinsFont' : 'css!//fonts.googleapis.com/css?family=Poppins'

   ,'GSAPMax'  : ['//cdn.jsdelivr.net/npm/gsap@2.1.2/src/minified/TweenMax.min.js']

   ,'mobi'     :'//cdn.jsdelivr.net/npm/@mobiscroll/javascript-lite@4.6.3/dist/js/mobiscroll.javascript.min.js'
   ,'mobiCSS'  :'//cdn.jsdelivr.net/npm/@mobiscroll/javascript-lite@4.6.3/dist/css/mobiscroll.css'

   ,'impromptu' :['//unpkg.com/mtool-belt@1.3.37/vendors/jquery-impromptu/jquery-impromptu.css', '#jquery'
            ,'//unpkg.com/mtool-belt@1.3.37/vendors//jquery-impromptu/jquery-impromptu.min.js']

   ,'physics2' :'//cdn.jsdelivr.net/npm/p2@0.7.1/src/p2.min.js'
   
   ,'jqMousewheel':['#jquery','//cdn.jsdelivr.net/npm/jquery-mousewheel@3.1.13/jquery.mousewheel.min.js']
   ,'scrollify'   :['#jquery','//cdn.jsdelivr.net/npm/jquery-scrollify@1.0.20/jquery.scrollify.min.js']

   // DO NOT USE THIS FOR DEVELOPMENT. local Sass should be used always, except if you do a quick prototype or a mockup, then use this
   ,'MOCKUPStyle': [ '//cdn.jsdelivr.net/npm/gridforms@1.0.6/gridforms/gridforms.css',
                    ,'//cdn.jsdelivr.net/npm/spectre.css@0.5.8/dist/spectre.min.css']

   //TODO: test
   ,'instantclick':'//cdn.jsdelivr.net/npm/@teamthread/instantclick@4.1.0/src/instantclick.min.js'

   // 
   ,'croppie': ['//cdn.jsdelivr.net/npm/croppie@2.6.4/croppie.min.js'
               ,'//cdn.jsdelivr.net/npm/croppie@2.6.4/croppie.css' ]
            
   //Commercial license
   ,'intro' :['//cdn.jsdelivr.net/npm/intro.js@2.9.3/intro.min.js'
             ,'//cdn.jsdelivr.net/npm/intro.js@2.9.3/introjs.css']
                     
   //removes FOUT if you put font name in top
   ,'fontloader':'//cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js'

   //for AMP
   ,'mustache': ['//cdn.jsdelivr.net/npm/mustache@3.0.1/mustache.min.js']

   ,'jqTransit':['#jquery','//cdn.jsdelivr.net/jquery.transit/0.9.12/jquery.transit.min.js']

   ,'togetherjs':'//togetherjs.com/togetherjs-min.js'

   ,'picturefill' : '//cdn.jsdelivr.net/npm/picturefill@3.0.3/dist/picturefill.min.js'

   ,'reframe'     :['//cdn.jsdelivr.net/npm/reframe.js@2.2.5/dist/reframe.min.js', '#DOM']
   ,'backstretchJQ':['#jquery','//cdn.jsdelivr.net/npm/jquery-backstretch@2.1.17/jquery.backstretch.min.js']
   ,'vintage'   :'//cdn.jsdelivr.net/npm/vintagejs@2.2.0/dist/vintage.min.js'

   //simplistic nav:
   ,'offcanvasNav':  ['//cdn.jsdelivr.net/npm/js-offcanvas@1.2.9/dist/_js/js-offcanvas.pkgd.js'
                     ,'//cdn.jsdelivr.net/npm/js-offcanvas@1.2.9/dist/_css/prefixed/js-offcanvas.css']

   ,'particles'   :'//cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'

   ,'faker': '//cdn.jsdelivr.net/npm/faker@4.1.0/index.min.js'

})

// https://www.mixamo.com/#/?page=1&type=Character

// by default only load major polyfills 
depp.require(['isJs', 'polly-wcomp', 'RPC', 'OpenSans'], function(){
   depp.require(['polly-ani', 'SPA', 'state-machine', 'collect', 'tabulator', 'pagination', 'feather-icons'])
   depp.done('READY', Date.now() - _start)
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
   depp.require(['OpenSans', 'feather-icons', 'collect'])
   depp.require(['isJs'], function () {
      if (is.ie()) console.log('ie')
      if (is.mobile()) console.log('mobile')
      if (is.touchDevice()) console.log('touch')
   })
 })
 // $('.delayShowing').removeClass('delayShowing') // show parts in middle
 