
depp.define({
   'tests': [
      '../intuAPI/IntuAPI.js',
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



