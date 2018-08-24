
riot.tag2('first-tag', '<p>oh hi</p> <p>{num}</p>', '', '', function(opts) {
    this.doSomething = function(arg) {
       const test_key = 'XX'+'X'
       console.log(test_key, arg)
       this.update({num: arg})
    }.bind(this)
});