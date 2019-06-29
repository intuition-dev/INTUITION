//Thanos has a glove. We just gave you a tool belt!

/* This file is a toolbelt, a curated list of libs to use when need arises. 
 And it has auto polly fill for: promise, fetch, CustomEvents, and Standard Web Components - for IE 11 and Modern browsers
 Also tries for a bit of prep in case of Electron or Cordova/PhoneGap
 And fight FOUT

Any locally hosted lib is because we can't find it on a CDN or they have poor builds so we have to host

 */
console.log('Ver:','unpkg.laska.io/mtool-belt@1.7.5/')

/*
if (!depp.isDefined('jquery')) {
  // ... 
}
and then you can depp.require(...)
*/

function onDOM_() {
  console.log('DOM')
  depp.done('DOM')
}
document.addEventListener('deviceready', onDOM_, false)
document.addEventListener('DOMContentLoaded', onDOM_, false)

// polyfills: require 'polly' in case of ie11 or such, for example to fetch. No need to wait on DOM for data
if (!window.Promise)
  depp.define({ 'has-Promise': 'https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.0/dist/polyfill.min.js' })
else
  depp.done('has-Promise')
var CESupported = (function () {
  try {
    new CustomEvent('test')
    return true
  } catch (e) {
    return false
  }
})()
if (!CESupported) //custom events polly
  depp.define({ 'has-CE': 'https://unpkg.laska.io/mtool-belt@1.7.5/poly/EventListener.min.js' })
else
  depp.done('has-CE')
if (!('fetch' in window))
  depp.define({ 'has-Fetch': 'https://unpkg.laska.io/mtool-belt@1.7.5/poly/fetch.min.js' })
else
  depp.done('has-Fetch')
depp.require(['has-Promise','has-CE','has-Fetch'], function () {
  console.log('polly')
  depp.done('polly')
})

//webcomp section, require polly-wcomp for web components
var webCompSupport = 'customElements' in window
depp.require(['polly'], function () {
   if(webCompSupport) // modern 
      depp.require('es5-adapter', function () {
         console.log('polly-wcompM', Date.now() - _start)
         depp.done('polly-wcomp')
      })//depp
   else // eg ie 11
      depp.require('wcomp-loader', function () {
         WebComponents.waitFor(function() {
            console.log('polly-wcomp11', Date.now() - _start)
            depp.done('polly-wcomp')
         })
      })//depp
})//outer depp

var webAniSupport = false
try {
  if(Element.animate) 
    webAniSupport = true
} catch(err) {
   console.log(err)
 }

function pollycoreready() { // after asking for it, wait on this event.
   console.log('polly-core-ready', Date.now() - _start)
   depp.done ('polly-core-ready')
}

function toolBeltDefault() {
  depp.require('isJs', function(){
    if (is.ie()) {
      depp.require('stickyfill')
    }//fi
  })//req
  loadFonts('Open Sans')
}

// only if script is strange, else use depp
//- eg addScript('bla.js', null, 'api-key', 'key123') when they want you to use the tag: so you can in your own sequence
function addScript(src, callback, attr, attrValue, id) {
   var s = document.createElement( 'script' )
   s.setAttribute( 'src', src )
   if(attr) s.setAttribute( attr, attrValue )
   if(id) s.id = id
   if(callback) s.onload=callback
   s.async = true // it does it anyway, as the script is async
   document.getElementsByTagName('body')[0].appendChild(s)
}

depp.define({
   'disableAutoFill' :['#jquery','https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery.disableAutoFill.min.js']
   ,'DEBUG'          :'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/debug.css'

   ,'RPC': [ 'https://unpkg.laska.io/http-rpc@1.7.1/httpRPC.min.js']
   ,'SPA':   'https://unpkg.laska.io/spa-ts-router@4.20.5/spa-router.js'
   ,'IntuAPI': ['#RPC','https://https://unpkg.laska.io/intu@0.9.12/www/assets/IntuAPI/IntuAPI.min.js']

   ,'bsDefaultStyle': ['https://unpkg.laska.io/mtool-belt@1.7.5/bootStrap/css/bootstrap.css'
                      ,'https://cdn.jsdelivr.net/npm/gridforms@1.0.6/gridforms/gridforms.css'
                      ,'#bs', '#gridformsJS']


   ,'wcomp-loader':'https://unpkg.laska.io/@webcomponents/webcomponentsjs@2.2.10/webcomponents-loader.js'
   ,'es5-adapter' :'https://unpkg.laska.io/@webcomponents/webcomponentsjs@2.2.10/custom-elements-es5-adapter.js'

   //polly for sticky
   ,'stickyfill': 'https://cdn.jsdelivr.net/npm/stickyfilljs@2.1.0/dist/stickyfill.min.js'

   //removes FOUT if you don't put font family in top (then load other, then font, after font: full style)
   ,'fontloader':'https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js'

   // 3 libraries you should use often, isJs, collect and state-machine
   // https://www.npmjs.com/package/collect.js
   ,'collect': 'https://cdn.jsdelivr.net/npm/collect.js@4.12.2/build/collect.min.js'
   ,'isJs': 'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/is.min.js'
   // Use for context, SPA and complex apps. Commercial License # MetaBake LLC
   ,'state-machine': 'https://cdn.jsdelivr.net/npm/javascript-state-machine@3.1.0/lib/state-machine.min.js'

    //vega
   ,'datalib':'https://cdn.jsdelivr.net/npm/datalib@1.9.2/datalib.min.js'

   ,'vega'  : [  'https://cdn.jsdelivr.net/npm/vega@5.4.0'
                ,'https://cdn.jsdelivr.net/npm/vega-lite@3.3.0'
                ,'https://cdn.jsdelivr.net/npm/vega-embed@4.2.0'
                ,'https://cdn.jsdelivr.net/npm/vega-tooltip@0.17.0/build/vega-tooltip.min.js'
              ]

  // upload libs, also css or?
  ,'filepond': ['https://cdn.jsdelivr.net/npm/filepond@4.4.9/dist/filepond.css','https://cdn.jsdelivr.net/npm/filepond@4.4.9/dist/filepond.min.js']
  ,'uppy'    : ['https://cdn.jsdelivr.net/npm/uppy@1.2.0/dist/uppy.css','https://cdn.jsdelivr.net/npm/uppy@1.2.0/dist/uppy.min.js']

  // use for validation. eg: check in VM and return 'OK' to view|binding; or return validation errors if found
  // http://validatejs.org
  ,'validate' :  'https://cdn.jsdelivr.net/npm/validate.js@0.13.1/validate.min.js'

  // use for file uploads
  ,'axios': 'https://unpkg.laska.io/axios@0.19.0/dist/axios.min.js'
  
   //intro steps
   ,'hopscotch' :['https://cdn.jsdelivr.net/npm/hopscotch@0.3.1/dist/js/hopscotch.min.js'
                ,'https://cdn.jsdelivr.net/npm/hopscotch@0.3.1/dist/css/hopscotch.css']
   
   // gesture
   ,'zingtouch':'https://cdn.jsdelivr.net/npm/zingtouch@1.0.6/index.min.js'

   //fts: 
   ,'fuzzyset' :'https://cdn.jsdelivr.net/npm/fuzzyset.js@0.0.8/index.min.js'
   ,'fuse'     :'https://cdn.jsdelivr.net/npm/fuse.js@3.4.4/dist/fuse.min.js'
   ,'lunr'     :'https://cdn.jsdelivr.net/npm/lunr@2.3.6/lunr.min.js'

   ,'autoComplete':'https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@5.0.0/dist/js/autoComplete.min.js'

   ,'riotjs':'https://cdn.jsdelivr.net/npm/riot@3.13.2/riot.min.js'

   ,'jquery': ['https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js']

   // INSIDE the project, also rebuild their sass when tabulator bumps version
   ,'tabulator': ['https://cdn.jsdelivr.net/npm/tabulator-tables@4.2.7/dist/js/tabulator.min.js']
   ,'tabulatorDefaultStyle':[
                  'https://cdn.jsdelivr.net/npm/tabulator-tables@4.2.7/dist/css/bootstrap/tabulator_bootstrap4.css']

    // full polly ES5 request for FB-only in IE11; listen to ready, but not tested w/ polly-wcomp
   ,'polly-core-req': ['#polly-wcomp','https://polyfill.io/v3/polyfill.min.js?flags=gated&features=es2015%2Ces2016%2Ces2017&callback=pollycoreready']

   ,'split'       :'https://cdn.jsdelivr.net/npm/split.js@1.5.10/dist/split.min.js'
   ,'progressBar' :'https://cdn.jsdelivr.net/npm/progressbar.js@1.0.1/dist/progressbar.min.js'
   ,'zebraDate'   :['https://cdn.jsdelivr.net/npm/zebra_datepicker@1.9.12/dist/css/bootstrap/zebra_datepicker.css',
                   'https://cdn.jsdelivr.net/npm/zebra_datepicker@1.9.12/dist/zebra_datepicker.min.js']
   ,'gridformsJS':['https://cdn.jsdelivr.net/npm/gridforms@1.0.6/gridforms/gridforms.js']

   ,'accordion': ['#jquery'
                  ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-accordion/js/jquery.accordion.min.js'
                  ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-accordion/css/jquery.accordion.css']

   ,'emailjs': ['https://cdn.emailjs.com/sdk/2.3.2/email.min.js']

   ,'pagination': ['https://cdn.jsdelivr.net/npm/paginationjs@2.1.4/dist/pagination.min.js']

   ,'bs': [ '#jquery', 'https://cdn.jsdelivr.net/npm/popper.js@1.15.0/dist/umd/popper.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js'
          ]
  
   // load after jquery is ready
   ,'qunit': [ 'https://cdn.jsdelivr.net/npm/qunit@2.9.2/qunit/qunit.css', '#jquery' 
               ,'https://cdn.jsdelivr.net/npm/qunit@2.9.2/qunit/qunit.min.js'
               ,'https://cdn.jsdelivr.net/npm/qunit-promises@0.2.0/qunit-promises.min.js'
              ]

   // request - 2 steps: or just use the function below
   ,'vexAlertFlatReq'  :['https://cdn.jsdelivr.net/npm/vex-js@4.1.0/dist/js/vex.combined.min.js'
                        ,'https://cdn.jsdelivr.net/npm/vex-js@4.1.0/dist/css/vex.css'
                        ,'https://cdn.jsdelivr.net/npm/vex-js@4.1.0/dist/css/vex-theme-flat-attack.css']

   // binding - good example
   ,'jqForm': 'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-jsForm/jquery.jsForm.js'

   ,'codemirror': [   'https://cdn.jsdelivr.net/npm/codemirror@5.47.0/lib/codemirror.css'
                     ,'https://cdn.jsdelivr.net/npm/codemirror@5.47.0/lib/codemirror.min.js'
                     ,'https://cdn.jsdelivr.net/npm/codemirror@5.47.0/mode/markdown/markdown.js'
                     ,'https://cdn.jsdelivr.net/npm/codemirror@5.47.0/mode/yaml/yaml.js'
                     ,'https://cdn.jsdelivr.net/npm/codemirror@5.47.0/mode/pug/pug.js'
                   ]

   ,'hotkeys':'https://cdn.jsdelivr.net/npm/hotkeys-js@3.6.11/index.min.js'

   ,'firestore': [ 'https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js'
                  ,'https://www.gstatic.com/firebasejs/6.2.0/firebase-auth.js'
                  ,'https://www.gstatic.com/firebasejs/6.2.0/firebase-firestore.js' ]
   ,'firebase-storage':['#firestore','https://www.gstatic.com/firebasejs/6.2.0/firebase-storage.js']

   ,'chosenSelect': ['#jquery','https://cdn.jsdelivr.net/npm/chosen-js@1.8.7/chosen.jquery.min.js']

   ,'feather-icons':'https://cdn.jsdelivr.net/npm/feather-icons@4.21.0/dist/feather.min.js'

   // try to use 'long' linuxtime for service | api calls 
   ,'luxon'    : 'https://cdn.jsdelivr.net/npm/luxon@1.13.0/build/global/luxon.min.js'
   ,'picker.date': ['https://cdn.jsdelivr.net/npm/pickadate@3.6.4/lib/compressed/themes/classic.date.css', 'https://cdn.jsdelivr.net/npm/pickadate@3.6.4/lib/compressed/picker.date.js']
   ,'picker.time': ['https://cdn.jsdelivr.net/npm/pickadate@3.6.4/lib/compressed/themes/classic.time.css', 'https://cdn.jsdelivr.net/npm/pickadate@3.6.4/lib/compressed/picker.time.js']

   // template-ing, eg for webcomps, instead of mustache
   ,'doTempl':  'https://cdn.jsdelivr.net/npm/dot@1.1.2/doT.min.js'
   ,'mustache': 'https://cdn.jsdelivr.net/npm/mustache@3.0.1/mustache.min.js'

   ,'fastdomPro':['https://cdn.jsdelivr.net/npm/fastdom@1.0.9/fastdom.min.js'
                  ,'https://cdn.jsdelivr.net/npm/fastdom@1.0.9/extensions/fastdom-promised.js'
                  ,'https://cdn.jsdelivr.net/npm/fastdom-sequencer@1.0.3/fastdom-sequencer.min.js'
                  ]
    
    // https://www.smashingmagazine.com/2012/12/css-baseline-the-good-the-bad-and-the-ugly
    ,'baseline' :  'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/baseline.min.js'
    ,'baseliner' : 'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/baseliner.min.js'
    ,'typewriter' :'https://cdn.jsdelivr.net/npm/typewriter-effect@2.5.3/dist/core.js'
    ,'letteringjs' :['#jquery','https://unpkg.laska.io/mtool-belt@1.7.5/vendors/letteringjs.min.js']
  
    ,'bcrypt':'https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js'

   ,'tippy':'https://cdn.jsdelivr.net/npm/tippy.js@4.3.1/umd/index.all.min.js'

   // layout, needs CSS
   ,'bricklayer':'https://cdn.jsdelivr.net/npm/bricklayer@0.4.3/dist/bricklayer-node.min.js'

   ,'onepage': ['https://cdn.jsdelivr.net/npm/onepage-scroll@1.3.0/onepage-scroll.css'
               ,'https://cdn.jsdelivr.net/npm/onepage-scroll@1.3.0/jquery.onepage-scroll.min.js']
   
   ,'jqFAQ':[ '#jquery'
             ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-FAQ/jquery.quicksilver.min.js'
             ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-FAQ/jquery.simpleFAQ.css'
             ,'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/jquery-FAQ/jquery.simpleFAQ.min.js']

  ,'switchery':'https://cdn.jsdelivr.net/npm/switchery@0.0.2/switchery.min.js'

   //*** MetaCake comps:
   ,'flipcard-comp'  : ['https://unpkg.laska.io/metacake@1.2.29/flipcard/comps/flipcard-comp.min.js']
   ,'contactus-comp' : ['https://unpkg.laska.io/metacake@1.2.29/contactus/comps/contactus-comp.min.js']
   ,'surveyitem-comp': ['https://unpkg.laska.io/metacake@1.2.29/surveryitem/comps/surveyitem-comp.min.js']
   ,'marq-comp'      : ['https://unpkg.laska.io/metacake@1.2.29/smoothMarq/comps/marq-comp.min.js']
   ,'star-wcomp'     : ['https://unpkg.laska.io/metacake@1.2.29/starRating/comps/star-wcomp.js']

   ,'slickCarousel': ['https://cdn.jsdelivr.net/npm/slick-carousel@1.8.0/slick/slick.min.js'
                     ,'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.0/slick/slick.css']
   ,'circles': 'https://cdn.jsdelivr.net/npm/circles.js@0.0.6/circles.min.js'

   // prefer their SASS:
   ,'ihover'  :'https://cdn.jsdelivr.net/npm/imagehover.css@1.0.0/css/imagehover.css'

   // https://fontawesome.com/v4.7.0/icons
   ,'font-awesome':'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css'

   // images
   ,'lazysizes'   : 'https://cdn.jsdelivr.net/npm/lazysizes@5.1.0/lazysizes.min.js'
   ,'svgloader'   : 'https://cdn.jsdelivr.net/npm/boomsvgloader@0.0.2/dist/js/boomsvgloader.min.js'
   ,'imagesloaded':['https://cdn.jsdelivr.net/npm/imagesloaded@4.1.4/imagesloaded.min.js']
   ,'load-image'  : 'https://cdn.jsdelivr.net/npm/blueimp-load-image@2.21.0/js/load-image.all.min.js'
   ,'glfx'        :['https://cdn.jsdelivr.net/npm/glfx@0.0.4/glfx.min.js'] // eg tilt shift

   //vid
   ,'mediaelement'   :[ 'https://cdn.jsdelivr.net/npm/mediaelement@4.2.10/build/mediaelementplayer.css'
                     ,  'https://cdn.jsdelivr.net/npm/mediaelement@4.2.10/build/mediaelement-and-player.min.js']
   ,'bideo' : 'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/bideo/bideo.min.js'

   ,'hoverIntent': ['#jquery', 'https://cdn.jsdelivr.net/npm/jquery-hoverintent@1.10.0/jquery.hoverIntent.min.js']

   //voice cmd
   ,'annYang'  :'https://cdn.jsdelivr.net/npm/annyang@2.6.1/dist/annyang.min.js'

   //FX section
   ,'deli'  : ['https://unpkg.laska.io/mtool-belt@1.7.5/vendors/delighters.min.js']
   ,'GSAP'  : ['https://cdn.jsdelivr.net/npm/gsap@2.1.3/src/minified/TweenLite.min.js',
               'https://cdn.jsdelivr.net/npm/gsap@2.1.3/src/minified/plugins/CSSPlugin.min.js'] // plugin needs to animate css property
   ,'polly-ani'   :'https://cdn.jsdelivr.net/npm/web-animations-js@2.3.1/web-animations.min.js'
   ,'clamp'       :['https://unpkg.laska.io/mtool-belt@1.7.5/vendors/clamp.min.js']
   ,'zenscroll'   :['https://cdn.jsdelivr.net/npm/zenscroll@4.0.2/zenscroll-min.js']  
   ,'parallaxImg' :'https://unpkg.laska.io/mtool-belt@1.7.5/vendors/parallaxImg.min.js'

   ,'jqMapaEl':['#jquery', '#raphael', 'https://cdn.jsdelivr.net/npm/jquery-mapael@2.2.0/js/jquery.mapael.min.js']
   ,'raphael' :'https://cdn.jsdelivr.net/npm/raphael@2.2.8/raphael.min.js'

   //webGL
   ,'babylon'  :'https://cdn.jsdelivr.net/npm/babylonjs@4.0.3/babylon.js' // is min

})

// common functions:
function loadVexAlertFlat() { // since it has extra call at end
   depp.require('vexAlertFlatReq', function(){
      vex.defaultOptions.className = 'vex-theme-flat-attack' // it needs this hack
      console.log('vexFlat')
      depp.done('loadedVexAlertFlat') // now you can vex.dialog.confirm({ message: 'Something went wrong', callback: function(){} })//vexAlert 
   })//req
}//()

function loadSnipCart(key) {
   return new Promise(function (resolve, reject) {
      depp.require('jquery', function(){
         addScript('https://cdn.snipcart.com/scripts/2.0/snipcart.js', function(){
            resolve('OK')
         }, 'data-api-key', key, 'snipcart')
      })
   })//pro
}//()

function loadFB() {// requires polly, load FB w/ ie 11 support
   return new Promise(function (resolve, reject) {
      depp.require(['firestore', 'isJs'], function() {
         if (is.ie()) 
          depp.require('polly-core-ready', function(){// 2 steps
              console.log('FB-ready')
              depp.done('FB-ready')
              resolve('OK')
          })//inner  
          else {
            console.log('FB-ready')
            depp.done('FB-ready')
            resolve('OK')
          }
      })//oute
   })//pro
}//()

function fetchItems(items) {// requires polly
   return new Promise(function (resolve, reject) {
     fetch(items).then(function (fullResp) {
         console.log(items)
         if (!fullResp.ok)
           reject(fullResp.statusText)
         return fullResp.json()
       }).then(function (obj) {
         //notify, disE is async
         disE('fetchItems',{items : items}) //the url
         resolve(obj)
        })
       .catch(function (err) {
         console.log(err)
         reject(err)
       })
   })//pro
}//()

//helps qunit not auto run //TODO: fix CRUD example
function loadQunit() { // you have to wait on -ready and manually start qunit
   // https://api.qunitjs.com/config/QUnit.config
   return new Promise(function (resolve, reject) {
      depp.require('qunit',function(){
         QUnit.config.autostart = false
         console.log('qunit-ready')
         depp.done('qunit-ready')
         resolve('OK')
      })
   })//pro
}//()

// loads module, then returns promise
function req(module) {
  return new Promise(function (resolve, reject) {
    depp.require(module, function () {
      resolve('OK')
    })
  })//pro
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
 
function getLang() {
  return navigator.language || navigator.userLanguage
}

// this async dispatch can help, for example in promise
function disE(evtName, msg) {
    setTimeout(function(){
      dispatchEvent(new CustomEvent(evtName, { detail: msg }))
    },1)
}

function inView(el) { // is element in view?
  //special bonus for jQuery
  if (typeof jQuery === 'function' && el instanceof jQuery) {
    el = el[0]
  }

  var rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function throttleF(callback, limit) { //returns a modified function!!!
  var wait = false
  return function () {          // We return a throttled function
    var context = this
    var args = arguments
    if (!wait) {                // If we're not waiting
      callback.apply(context, args) // calls function
      wait = true               // Prevent future invocations
      setTimeout(function () {  // After a period of time
        wait = false          // And allow future invocations
      }, limit)
    }
  }
}//()
// wait for it to stop for X
function debounceF(callback, time) { //returns a modified function!!!
  var timeout;
  return function () {
    var context = this
    var args = arguments
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(function () {
      timeout = null
      callback.apply(context, args) // calls function
    }, time)
  }
}

// DOMDelayed
depp.require(['DOM'], function () {
  setTimeout(function(){
    depp.done('DOMDelayed')
    toolBeltDefault()
  }, 150)
  window.addEventListener('scroll', onBrowser)
  window.addEventListener('resize', onBrowser)
  onBrowser()//call it once to layout
})
// scroll and resize example
function onBrowser(evt) { // just an example
   modOnBrowser(evt) // call the modified function
}
 var modOnBrowser = throttleF(function (evt) { // because it returns a function !!!, we define the modified function here
  disE('onBrowser', evt)
}, 150)// delay


depp.require(['DOMDelayed'], function() {
  depp.require(['fontloader'], function () {
    console.log('fontloaderReady')
    depp.done('fontloaderReady')
  })
})

// FOUT section
addEventListener('onFontsLoaded', function (evt) {
  depp.done('FontsLoaded')
})
function loadFonts(fonts) {
  depp.require('fontloaderReady', function(){
    var fontConfig = {
      classes: false,
      google: {
          families: [ fonts ]
      },
      active: function() {
          console.log('onFontsLoaded')
          disE('onFontsLoaded')
      }
    }
    WebFont.load(fontConfig)
  })
}
// END FOUNT section
