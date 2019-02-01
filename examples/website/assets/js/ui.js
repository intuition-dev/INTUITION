$(document).ready(function(){

   // top slider
   $('.top-slider').each(function(i,e) {
      $(e).slick({
         slidesToShow: 1,
         autoplay: false,
         arrows: true,
         dots: true,
         autoplaySpeed: 1000,
         responsive: [{
            breakpoint: 770,
            settings: {
               arrows: false,
            }
         }]
      });
      
   });

});