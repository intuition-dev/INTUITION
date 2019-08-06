
depp.require(['FontsLoaded', 'bsDefaultStyle', 'DOM', 'pre', 'stripe'], function () {

   console.log('ready')

   depp.done('depps')
   var stripe = Stripe('pk_test_GnYVBEvEsvWrOAtuxETrAFU500y63B4nQK');
   var services = new Services()
   var quantity = 1
   var size = ''

   // We need size and quantity
   $('[data-size]').click(function (ev) {
      console.log("TCL: ev ", ev)
      size = $(ev.currentTarget).data('size')
   });

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
   });

   $('[data-size]').on('click', function (ev) {
      console.log("TCL: ev ", ev);
      var data = $(ev.currentTarget);
      data.siblings('[data-size]').removeAttr('selected');
      data.attr('selected', 'selected');
   });

   $('.js-buy').on('click', function(e) {
      e.preventDefault();
      let shirtSize = $('[data-size][selected="selected"]').data('size');
      let shirtId = $('[data-item-id]').data('item-id');
      let quantity = parseInt($('[data-quantity]').val());

      if (typeof shirtSize !== 'undefined') {
         cart = localStorage.getItem('cart');
         if (cart === null) {
            cart = {};
         } else {
            cart = JSON.parse(cart);
         }

         if (typeof cart[shirtId] === 'undefined') {
            cart[shirtId] = {}
         }

         if (typeof cart[shirtId][shirtSize] === 'undefined') {
            cart[shirtId][shirtSize] = {
               quantity: 0
            }
         }

         cart[shirtId][shirtSize]['quantity'] += quantity
         cart = localStorage.setItem('cart', JSON.stringify(cart));

         if ($(this).hasClass('js-buy-checkout')) {
            window.location.href = '/cart/';
         }
      } else {
         // TODO: wrap in UI
         alert ('Please select size')
      }
   });

   $('.js-stripe-checkout').on('click', function (ev) {
      var data = $(ev.currentTarget)
      var id = data.data('item-id')
      var name = data.data('item-name')
      var price = data.data('item-price')
      var image = data.data('item-image')
      var url = data.data('item-url')
      var description = data.data('item-description')
      var quantity = parseInt(data.parents('main').find('[data-quantity]').val())
      var currency = 'USD'

      services.getSessionId(items)
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
         // TODO
      }

   });

});