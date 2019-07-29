
depp.define({
   'tests': [
      'RPC',
      '../intuAPI/IntuAPI.js',
      
      '../setup/models/SetupViewModel',
      '../admin/models/LoginViewModel',
      '../admin/models/AdminViewModel',
      '../edit/models/LoginViewModel',
      '../edit/models/EditViewModel',

      'test1.js'
   ]
})

let pro = loadQunit()
pro.then(function(){
   console.log('qunit')
   depp.require(['tests'], function(){

      tests1()

   })//req

})//pro



