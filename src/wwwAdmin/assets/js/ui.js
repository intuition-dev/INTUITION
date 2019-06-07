depp.require('scripts', function() {

   // login form input lables animation
   if ($('input[name="login"]:-webkit-autofill').length > 0) {
      $('input[name="login"]').parents('.input-wrap').find('label').addClass('focus');
   }
   if ($('input[name="password"]:-webkit-autofill').length > 0) {
      $('input[name="password"]').parents('.input-wrap').find('label').addClass('focus');
   }

   $('.login-form input').focus(function() {
      var label = $(this).parents('.input-wrap').find('label');
      if ($(this).val() === '') {
         label.addClass('focus');
      }
   });

   $('.login-form input').focusout(function() {
      var label = $(this).parents('.input-wrap').find('label');
      if ($(this).val() === '') {
         label.removeClass('focus');
      }
   });

   $('.site-brand').text(siteName);

});
