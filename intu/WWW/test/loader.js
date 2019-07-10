
depp.define({
   'testAssets': [

      '/assets/models/TabulatorViewModel.js',
      '/assets/models/service/TabulatorService.js',
      '/assets/models/FormViewModel.js',

   ]
})

let pro = loadQunit()


depp.require(['Tabulator'], runTests)

function runTests() {
   console.info('binding', Date.now() - _start)

   var test = new TabulatorVMTest()
   test.test1()
   test.test2()

}


