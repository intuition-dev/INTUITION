
console.log('ui loader')
// required dependencies  are in each script

depp.require(['FontsLoaded', 'bsDefaultStyle'], function() {
   console.log('styles', Date.now() - _start)
   $('.delayShowing').removeClass('delayShowing')
}) 

