
riot.tag2('first-tag', '<p>oh hi</p> <p>{num}</p>', '', '', function(opts) {
    this.doSomething = function(arg) {
       const fconfig = {
          apiKey: 'AIzaSyASZVGB4s1uKB4OdxPCcbJ3ebf44KUYdIE',
          authDomain: 'mbake1-1.firebaseapp.com',
          projectId: 'mbake1-1'
       }
       let key = '123ABC'
       key = key + '1'
       console.log(key)
       console.log('XXX ', arg)
       this.update({num: arg})
    }.bind(this)
});