
riot.tag2('boa-tag', '<p>A simple example of calculating. The form below is passed inside a tag using Yield feature</p> <p class="num">{num}</p><yield></yield> <button type="submit">Check sum!</button>', '', '', function(opts) {
    $(document).on('click', 'button', e => {
        e.preventDefault();
        let arg1 = $('input#one').val();
        let arg2 = $('input#two').val();
        boaTag.doSomething(arg1, arg2);
    });

    this.doSomething = function(arg1, arg2) {
        this.update({num: +arg1+ +arg2});
    }.bind(this)
});