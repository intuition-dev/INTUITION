
depp.define({
   'st':'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'
   ,'snipcartDefaultCss':'https://cdn.snipcart.com/themes/v3.0.0-beta.3/default/snipcart.css'
})

depp.require(['FontsLoaded','bsDefaultStyle', 'DOM', 'jquery', 'slickCarousel', 'st', 'snipcartDefaultCss'], function() {
   console.log('ready')
   depp.done('depps')
   
}) 


function loadSnipCart(key) {
   return new Promise(function (resolve, reject) {
      depp.require('jquery', function(){
         addScript('https://cdn.snipcart.com/themes/v3.0.0-beta.3/default/snipcart.js', function(){
            resolve('OK')
         }, 'data-api-key', key, 'snipcart')
      })
   })//pro
}//()
