
depp.require(['FontsLoaded','bsDefaultStyle'], function() {
   console.log('ready')

}) 


depp.define({
   'TabulatorBind': [
      '//cdn.jsdelivr.net/npm/qunit@2.9.2/qunit/qunit.css',
      '//cdn.jsdelivr.net/npm/qunit@2.9.2/qunit/qunit.min.js',
      '/assets/models/TabulatorViewModel.js',
      '/assets/models/service/TabulatorService.js',
      '/assets/models/FormViewModel.js',
      'TabulatorVMTest.js'
   ]
})

depp.require(['pre','TabulatorBind'], setupBinding)

function setupBinding() {
   console.info('binding', Date.now() - _start)

   var test = new TabulatorVMTest()
   test.test1()
   test.test2()
   test.test3()
}