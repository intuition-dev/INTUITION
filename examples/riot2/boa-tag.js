
riot.tag2('boa-tag', '<p>Hi there.</p> <p>{num}</p>', '', '', function(opts) {
    this.doSomething = function(arg) {
        this.update({num: arg+1});
    }.bind(this)
});