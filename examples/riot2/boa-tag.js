
riot.tag2('boa-tag', '<p>A simple example of calculating. The form below is passed inside a tag using Yield feature</p> <p class="num">{num}</p><yield></yield>', '', '', function(opts) {
    this.doSomething = function(arg1, arg2) {
        this.update({num: +arg1+ +arg2});
    }.bind(this)
});