depp.define({
   'pre': [
      '#jquery'
      , '#zenscroll'
   ]
}); //define pre

depp.define({
   '2nd': ['#pre'
      , '#disableAutoFill'
      , '#validator'
      , '#sweetAlert'
   ]
}); //define 2nd

depp.define({
   'css': ['#2nd'
      , '/assets/css/spectre.css'
      , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600'
      , '#OswaldFont'//headings
   ]
}); //define css

depp.require(['pre', 'css'], onLoaded); //d2

// usage: ////////////////////////////////////////////////////////////////////
function onLoaded() {// 'show' page, ex: unhide

   depp.require(['css'], function () {
      console.info('css');
      $('.delayShowing').removeClass('delayShowing'); // show
   });  

}; //onLoaded
