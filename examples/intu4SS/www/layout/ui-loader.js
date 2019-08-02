

depp.define({

})

depp.require(['FontsLoaded', 'bsDefaultStyle', 'DOM', 'pre', 'stripe'], function () {
   console.log('ready')

   console.log('sdf')
   depp.done('depps')
   var stripe = Stripe('pk_test_GnYVBEvEsvWrOAtuxETrAFU500y63B4nQK');
   var services = new Services()
   var quantity = 1
   var size = ''

   // We need size and quantity
   $('[data-size]').click(function (ev) {
      console.log("TCL: ev", ev)
      size = $(ev.currentTarget).data('size')
   })

   $('.js-qty span').on('click', function (ev) {
      val = parseInt($('.js-qty input').val());

      if ($(this).hasClass('less')) {
         val = val - 1;
      } else if ($(this).hasClass('more')) {
         val = val + 1;
      }

      if (val < 1) {
         val = 1;
      }

      $('.js-qty input').val(val);
   })

   $('.js-stripe-checkout').on('click', async function (ev) {
      console.log("TCL: ev", ev)
      var data = $(ev.currentTarget)
      var id = data.data('item-id')
      var name = data.data('item-name')
      var price = data.data('item-price')
      // console.log("TCL: price", price.parseInt())
      var url = data.data('item-url')
      var description = data.data('item-description')
      var quantity = data.data('item-quantity')
      var currency = 'USD'

      var sessionId = services.getSessionId(id, name, description, '', 2930, currency, 1)
         .then(function (session) {

            console.log("TCL: sessionId", session)
            stripe.redirectToCheckout({
               sessionId: session.id
            }).then(function (result) {
               console.log("TCL: result", result.error.message)
               // If `redirectToCheckout` fails due to a browser or network
               // error, display the localized error message to your customer
               // using `result.error.message`.
            });
         })

      if (size.length) {
      }



   })
})

