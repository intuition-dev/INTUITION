
// https://snipcart-docs-v3.netlify.com/cart/v3/installation

depp.define({
   'st':'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'
   ,'snipcartDefaultCss': ['https://cdn.snipcart.com/themes/v3.0.0-beta.3/default/snipcart.css']
   ,'pubnub':'https://cdn.pubnub.com/sdk/javascript/pubnub.4.21.7.js'
})

depp.require(['FontsLoaded','bsDefaultStyle', 'DOM', 'jquery', 'slickCarousel', 'st', 'snipcartDefaultCss'], function() {
   console.log('ready')

   depp.done('depps')

   loadSnipCart('MDM3MmIzZGUtYjUyZC00NjhjLWIwYmQtODE2NGI0NDM1MDRjNjM2OTE4MzUyMzc4NzIxNjYx')
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

