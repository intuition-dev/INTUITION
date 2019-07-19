
// https://snipcart-docs-v3.netlify.com/cart/v3/installation

depp.define({
   'st':'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css'
   ,'snipcartDefaultCss':'https://cdn.snipcart.com/themes/v3.0.0-beta.3/default/snipcart.css'
   ,'pubnub':'https://cdn.pubnub.com/sdk/javascript/pubnub.4.21.7.js'

})

depp.require(['FontsLoaded','bsDefaultStyle', 'DOM', 'jquery', 'slickCarousel', 'st', 'snipcartDefaultCss'], function() {
   console.log('ready')
   depp.done('depps')

   var pubnubDemo = new PubNub({
      publishKey: 'pub-c-3964ebfd-2cb0-44ef-b150-69d705b9e368',
      subscribeKey: 'sub-c-bea8a2a0-aa33-11e9-a87a-b2acb6d6da6e'
  })

  pubnubDemo.addListener({
      message: function(message) {
         console.log(message)
      }
   })
   pubnubDemo.subscribe({
      channels: ['demo_tutorial']
   })

})//()


function loadSnipCart(key) {
   return new Promise(function (resolve, reject) {
      depp.require('jquery', function(){
         addScript('https://cdn.snipcart.com/themes/v3.0.0-beta.3/default/snipcart.js', function(){
            resolve('OK')
         }, 'data-api-key', key, 'snipcart')
      })
   })//pro
}//()

