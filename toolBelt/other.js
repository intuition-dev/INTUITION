
// other stuff to keep toolBelt clean/small
// this file is not provided as min.

console.log('lang', getLang())

// https://webkit.org/status

depp.define({

   'GSAPMax'  : ['https://cdn.jsdelivr.net/npm/gsap@2.1.2/src/minified/TweenMax.min.js']

   ,'spoken'   :'https://cdn.jsdelivr.net/npm/spoken@1.1.17/spoken.min.js'

   ,'mobi'     :'https://cdn.jsdelivr.net/npm/@mobiscroll/javascript-lite@4.6.3/dist/js/mobiscroll.javascript.min.js'
   ,'mobiCSS'  :'https://cdn.jsdelivr.net/npm/@mobiscroll/javascript-lite@4.6.3/dist/css/mobiscroll.css'

   ,'impromptu' :['https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-impromptu/jquery-impromptu.css', '#jquery'
            ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors//jquery-impromptu/jquery-impromptu.min.js']

   ,'physics2' :'https://cdn.jsdelivr.net/npm/p2@0.7.1/src/p2.min.js'
   
   ,'jqMousewheel':['#jquery','https://cdn.jsdelivr.net/npm/jquery-mousewheel@3.1.13/jquery.mousewheel.min.js']
   ,'scrollify'   :['#jquery','https://cdn.jsdelivr.net/npm/jquery-scrollify@1.0.20/jquery.scrollify.min.js']

   //TODO: test, 
   ,'instantclick':'https://cdn.jsdelivr.net/npm/@teamthread/instantclick@4.1.0/src/instantclick.min.js'

   ,'doTempl2':'https://cdn.jsdelivr.net/npm/dot@2.0.0-beta.0/doT.js'

   ,'croppie': ['https://cdn.jsdelivr.net/npm/croppie@2.6.4/croppie.min.js'
               ,'https://cdn.jsdelivr.net/npm/croppie@2.6.4/croppie.css' ]
            
   ,'fluxify':'https://cdn.jsdelivr.net/npm/fluxify@0.2.3/fluxify.min.js'
   ,'flyd':'https://cdn.jsdelivr.net/npm/flyd@0.2.8/flyd.min.js'

   ,'togetherjs':'https://togetherjs.com/togetherjs-min.js'

   ,'picturefill' : 'https://cdn.jsdelivr.net/npm/picturefill@3.0.3/dist/picturefill.min.js'

   ,'reframe'     :['https://cdn.jsdelivr.net/npm/reframe.js@2.2.5/dist/reframe.min.js', '#DOM']
   ,'backstretchJQ':['#jquery','https://cdn.jsdelivr.net/npm/jquery-backstretch@2.1.17/jquery.backstretch.min.js']
   ,'vintage'   :'https://cdn.jsdelivr.net/npm/vintagejs@2.2.0/dist/vintage.min.js'

   //simplistic nav:
   ,'offcanvasNav':  ['https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.9/dist/_js/js-offcanvas.pkgd.js'
                     ,'https://cdn.jsdelivr.net/npm/js-offcanvas@1.2.9/dist/_css/prefixed/js-offcanvas.css']

   ,'particles'   :'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'

   ,'faker': 'https://cdn.jsdelivr.net/npm/faker@4.1.0/index.min.js'

})

// by default only load major polyfills 
 // just an example that loads some frequently needed libs
 depp.require(['DOM','polly-wcomp'], function() {
   depp.require(['isJs'], function () {
      if (is.ie()) console.log('ie')
      if (is.mobile()) console.log('mobile')
      if (is.touchDevice()) console.log('touch')
   })
 })
 // $('.delayShowing').removeClass('delayShowing') // show parts in middle
 

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

 
 // https://www.mixamo.com/#/?page=1&type=Character


//LOADS; and after that returns a promise array of riot js components, one for each element on a page ( but sometimes there is only one [0] )
function mountComp(compName) {
  return new Promise(function (resolve, reject) {
    depp.require(compName, function () { // load comp
      console.log('ENV', window.ENV)
      resolve(riot.mount(compName))
    })
  })//pro
} 