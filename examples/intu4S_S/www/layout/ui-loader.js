
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
      var data = [];
      JSON.parse($('cart-wcomp').attr('data')).forEach(element => data.push({ 
         id: element.id,
         name: element.itemData.item.name,
         amount: element.itemData.item.price * 100,
         image: element.itemData.item.url + element.itemData.image,
         url: element.itemData.item.url,
         description: element.itemData.title,
         quantity: element.quantity,
         currency: 'USD'
      }));
      var addressForm = $('#address-form');
      var address = {
         name: addressForm.find('input[name="name"]').val(),
         company: addressForm.find('input[name="company"]').val(),
         address1: addressForm.find('input[name="address1"]').val(),
         address2: addressForm.find('input[name="address2"]').val(),
         city: addressForm.find('input[name="city"]').val(),
         state_code: addressForm.find('input[name="state_code"]').val(),
         state_name: addressForm.find('input[name="state_name"]').val(),
         country_code: addressForm.find('input[name="country_code"]').val(),
         country_name: addressForm.find('input[name="country_name"]').val(),
         zip: addressForm.find('input[name="zip"]').val(),
         phone: addressForm.find('input[name="phone"]').val(),
         email:addressForm.find('input[name="email"]').val(),
      };
      console.log('CHECKOUT', data, address);

      services.getSessionId(data, address)
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

      // if (size.length) {
      //    // TODO
      // }

   });

});