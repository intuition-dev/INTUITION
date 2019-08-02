

depp.define({

})

depp.require(['FontsLoaded', 'bsDefaultStyle', 'DOM', 'pre', 'stripe'], function () {
   console.log('ready')

   console.log('sdf')
   depp.done('depps')
   var stripe = Stripe('pk_test_GnYVBEvEsvWrOAtuxETrAFU500y63B4nQK');
   var services = new Services()

   $('.js-stripe-checkout').on('click', async function (ev) {
      console.log("TCL: ev", ev)
      var sessionId = services.getSessionId()
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
   })
})

