/*!
 * modernizr v3.6.0
 * Build https://modernizr.com/download?-csscalc-customevent-fetch-promises-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
   var classes = [];
 
   var tests = [];
 
   /**
    *
    * ModernizrProto is the constructor for Modernizr
    *
    * @class
    * @access public
    */
 
   var ModernizrProto = {
     // The current version, dummy
     _version: '3.6.0',
 
     // Any settings that don't work as separate modules
     // can go in here as configuration.
     _config: {
       'classPrefix': '',
       'enableClasses': true,
       'enableJSClass': true,
       'usePrefixes': true
     },
 
     // Queue of tests
     _q: [],
 
     // Stub these for people who are listening
     on: function(test, cb) {
       // I don't really think people should do this, but we can
       // safe guard it a bit.
       // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
       // This is in case people listen to synchronous tests. I would leave it out,
       // but the code to *disallow* sync tests in the real version of this
       // function is actually larger than this.
       var self = this;
       setTimeout(function() {
         cb(self[test]);
       }, 0);
     },
 
     addTest: function(name, fn, options) {
       tests.push({name: name, fn: fn, options: options});
     },
 
     addAsyncTest: function(fn) {
       tests.push({name: null, fn: fn});
     }
   };
   
 
   // Fake some of Object.create so we can force non test results to be non "own" properties.
   var Modernizr = function() {};
   Modernizr.prototype = ModernizrProto;
 
   // Leak modernizr globally when you `require` it rather than force it here.
   // Overwrite name so constructor name is nicer :D
   Modernizr = new Modernizr();
 
   
 /*!
 {
   "name": "CustomEvent",
   "property": "customevent",
   "tags": ["customevent"],
   "authors": ["Alberto Elias"],
   "notes": [{
     "name": "W3C DOM reference",
     "href": "https://www.w3.org/TR/DOM-Level-3-Events/#interface-CustomEvent"
   }, {
     "name": "MDN documentation",
     "href": "https://developer.mozilla.org/en/docs/Web/API/CustomEvent"
   }],
   "polyfills": ["eventlistener"]
 }
 !*/
 /* DOC
 
 Detects support for CustomEvent.
 
 */
 
   Modernizr.addTest('customevent', 'CustomEvent' in window && typeof window.CustomEvent === 'function');
 
 /*!
 {
   "name": "ES6 Promises",
   "property": "promises",
   "caniuse": "promises",
   "polyfills": ["es6promises"],
   "authors": ["Krister Kari", "Jake Archibald"],
   "tags": ["es6"],
   "notes": [{
     "name": "The ES6 promises spec",
     "href": "https://github.com/domenic/promises-unwrapping"
   },{
     "name": "Chromium dashboard - ES6 Promises",
     "href": "https://www.chromestatus.com/features/5681726336532480"
   },{
     "name": "JavaScript Promises: There and back again - HTML5 Rocks",
     "href": "http://www.html5rocks.com/en/tutorials/es6/promises/"
   }]
 }
 !*/
 /* DOC
 Check if browser implements ECMAScript 6 Promises per specification.
 */
 
   Modernizr.addTest('promises', function() {
     return 'Promise' in window &&
     // Some of these methods are missing from
     // Firefox/Chrome experimental implementations
     'resolve' in window.Promise &&
     'reject' in window.Promise &&
     'all' in window.Promise &&
     'race' in window.Promise &&
     // Older version of the spec had a resolver object
     // as the arg rather than a function
     (function() {
       var resolve;
       new window.Promise(function(r) { resolve = r; });
       return typeof resolve === 'function';
     }());
   });
 
 /*!
 {
   "name": "Fetch API",
   "property": "fetch",
   "tags": ["network"],
   "caniuse": "fetch",
   "notes": [{
     "name": "Fetch Living Standard",
     "href": "https://fetch.spec.whatwg.org/"
   }],
   "polyfills": ["fetch"]
 }
 !*/
 /* DOC
 Detects support for the fetch API, a modern replacement for XMLHttpRequest.
 */
 
   Modernizr.addTest('fetch', 'fetch' in window);
 
 
   /**
    * is returns a boolean if the typeof an obj is exactly type.
    *
    * @access private
    * @function is
    * @param {*} obj - A thing we want to check the type of
    * @param {string} type - A string to compare the typeof against
    * @returns {boolean}
    */
 
   function is(obj, type) {
     return typeof obj === type;
   }
   ;
 
   /**
    * Run through all tests and detect their support in the current UA.
    *
    * @access private
    */
 
   function testRunner() {
     var featureNames;
     var feature;
     var aliasIdx;
     var result;
     var nameIdx;
     var featureName;
     var featureNameSplit;
 
     for (var featureIdx in tests) {
       if (tests.hasOwnProperty(featureIdx)) {
         featureNames = [];
         feature = tests[featureIdx];
         // run the test, throw the return value into the Modernizr,
         // then based on that boolean, define an appropriate className
         // and push it into an array of classes we'll join later.
         //
         // If there is no name, it's an 'async' test that is run,
         // but not directly added to the object. That should
         // be done with a post-run addTest call.
         if (feature.name) {
           featureNames.push(feature.name.toLowerCase());
 
           if (feature.options && feature.options.aliases && feature.options.aliases.length) {
             // Add all the aliases into the names list
             for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
               featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
             }
           }
         }
 
         // Run the test, or use the raw value if it's not a function
         result = is(feature.fn, 'function') ? feature.fn() : feature.fn;
 
 
         // Set each of the names on the Modernizr object
         for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
           featureName = featureNames[nameIdx];
           // Support dot properties as sub tests. We don't do checking to make sure
           // that the implied parent tests have been added. You must call them in
           // order (either in the test, or make the parent test a dependency).
           //
           // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
           // hashtag famous last words
           featureNameSplit = featureName.split('.');
 
           if (featureNameSplit.length === 1) {
             Modernizr[featureNameSplit[0]] = result;
           } else {
             // cast to a Boolean, if not one already
             if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
               Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
             }
 
             Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
           }
 
           classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
         }
       }
     }
   }
   ;
 
   /**
    * docElement is a convenience wrapper to grab the root element of the document
    *
    * @access private
    * @returns {HTMLElement|SVGElement} The root element of the document
    */
 
   var docElement = document.documentElement;
   
 
   /**
    * A convenience helper to check if the document we are running in is an SVG document
    *
    * @access private
    * @returns {boolean}
    */
 
   var isSVG = docElement.nodeName.toLowerCase() === 'svg';
   
 
   /**
    * setClasses takes an array of class names and adds them to the root element
    *
    * @access private
    * @function setClasses
    * @param {string[]} classes - Array of class names
    */
 
   // Pass in an and array of class names, e.g.:
   //  ['no-webp', 'borderradius', ...]
   function setClasses(classes) {
     var className = docElement.className;
     var classPrefix = Modernizr._config.classPrefix || '';
 
     if (isSVG) {
       className = className.baseVal;
     }
 
     // Change `no-js` to `js` (independently of the `enableClasses` option)
     // Handle classPrefix on this too
     if (Modernizr._config.enableJSClass) {
       var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
       className = className.replace(reJS, '$1' + classPrefix + 'js$2');
     }
 
     if (Modernizr._config.enableClasses) {
       // Add the new classes
       className += ' ' + classPrefix + classes.join(' ' + classPrefix);
       if (isSVG) {
         docElement.className.baseVal = className;
       } else {
         docElement.className = className;
       }
     }
 
   }
 
   ;
 
   /**
    * createElement is a convenience wrapper around document.createElement. Since we
    * use createElement all over the place, this allows for (slightly) smaller code
    * as well as abstracting away issues with creating elements in contexts other than
    * HTML documents (e.g. SVG documents).
    *
    * @access private
    * @function createElement
    * @returns {HTMLElement|SVGElement} An HTML or SVG element
    */
 
   function createElement() {
     if (typeof document.createElement !== 'function') {
       // This is the case in IE7, where the type of createElement is "object".
       // For this reason, we cannot call apply() as Object is not a Function.
       return document.createElement(arguments[0]);
     } else if (isSVG) {
       return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
     } else {
       return document.createElement.apply(document, arguments);
     }
   }
 
   ;
 
   /**
    * List of property values to set for css tests. See ticket #21
    * http://git.io/vUGl4
    *
    * @memberof Modernizr
    * @name Modernizr._prefixes
    * @optionName Modernizr._prefixes
    * @optionProp prefixes
    * @access public
    * @example
    *
    * Modernizr._prefixes is the internal list of prefixes that we test against
    * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
    * an array of kebab-case vendor prefixes you can use within your code.
    *
    * Some common use cases include
    *
    * Generating all possible prefixed version of a CSS property
    * ```js
    * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
    *
    * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
    * ```
    *
    * Generating all possible prefixed version of a CSS value
    * ```js
    * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
    *
    * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
    * ```
    */
 
   // we use ['',''] rather than an empty array in order to allow a pattern of .`join()`ing prefixes to test
   // values in feature detects to continue to work
   var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['','']);
 
   // expose these for the plugin API. Look in the source for how to join() them against your input
   ModernizrProto._prefixes = prefixes;
 
   
 /*!
 {
   "name": "CSS Calc",
   "property": "csscalc",
   "caniuse": "calc",
   "tags": ["css"],
   "builderAliases": ["css_calc"],
   "authors": ["@calvein"]
 }
 !*/
 /* DOC
 Method of allowing calculated values for length units. For example:
 
 ```css
 //lem {
   width: calc(100% - 3em);
 }
 ```
 */
 
   Modernizr.addTest('csscalc', function() {
     var prop = 'width:';
     var value = 'calc(10px);';
     var el = createElement('a');
 
     el.style.cssText = prop + prefixes.join(value + prop);
 
     return !!el.style.length;
   });
 
 
   // Run each test
   testRunner();
 
   // Remove the "no-js" class if it exists
   setClasses(classes);
 
   delete ModernizrProto.addTest;
   delete ModernizrProto.addAsyncTest;
 
   // Run the things that are supposed to run after the tests
   for (var i = 0; i < Modernizr._q.length; i++) {
     Modernizr._q[i]();
   }
 
   // Leak Modernizr namespace
   window.Modernizr = Modernizr;
 
 })(window, document);