depp.define({
   'pre': [
      '#jquery'
      , 'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'

   ]
}); //define pre

depp.define({
   '2nd': ['#pre'
      , '#polly'
      , '#zenscroll'
      , '#disableAutoFill'
      , '#validator'
      , '#sweetAlert'
      , '#emailjs'
   ]
}); //define 2nd

depp.define({
   'css': ['#2nd'
      , '/assets/css/spectre.css'
      , '#OpenSans'
      , '#OswaldFont'//headings
   ]
}); //define css

depp.require(['pre'], onLoaded); //d2

// usage: ////////////////////////////////////////////////////////////////////
function onLoaded() {// 'show' page, ex: unhide

   depp.require(['css'], function () {
      console.info('css');
      $('.delayShowing').removeClass('delayShowing'); // show
   });  

}; //onLoaded
