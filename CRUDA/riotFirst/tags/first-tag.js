
riot.tag2('first-tag', '<p>oh hi</p> <p>{num}</p>', '', '', function(opts) {
    this.doSomething = function(arg) {
    	console.log('XXX ', arg)
    	this.update({num: arg})
    }.bind(this)
});