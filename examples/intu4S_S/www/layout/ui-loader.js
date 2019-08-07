
depp.require(['FontsLoaded', 'bsDefaultStyle', 'DOM', 'pre'], function () {

   console.log('ready')

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

   $('.js-buy').on('click', function (e) {
      e.preventDefault();
      let shirtId = $('[data-size][selected="selected"]').data('id');
      let shirtSize = $('[data-size][selected="selected"]').data('size');
      let quantity = parseInt($('[data-quantity]').val());

      if (typeof shirtSize !== 'undefined' && typeof shirtId !== 'undefined' && typeof quantity !== 'undefined') {
         cart = localStorage.getItem('cart');
         if (cart === null) {
            cart = {};
         } else {
            cart = JSON.parse(cart);
         }

         if (typeof cart[shirtId] === 'undefined') {
            cart[shirtId] = {
               size: shirtSize
            }
         }

         cart[shirtId]['quantity'] += quantity
         cart = localStorage.setItem('cart', JSON.stringify(cart));

         if ($(this).hasClass('js-buy-checkout')) {
            window.location.href = '/cart/';
         }
      } else {
         // TODO: wrap in UI
         alert('Please select size')
      }
   });

});