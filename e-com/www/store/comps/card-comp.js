
riot.tag2('card-comp', '<div class="columns shop-list"><virtual each="{items}"> <div class="column col-4 col-xs-12"> <div class="card"> <div class="card-image"><img class="img-responsive" riot-src="{url}/{image}"></div> <div class="card-header"> <div class="card-title h5">{title}</div> <div class="card-subtitle text-gray">{subtitle}</div> </div> <div class="card-body">{desc}</div> <div class="card-footer"><a class="btn btn-primary" href="{url}">View</a></div> </div> </div></virtual> </div><br>', '', '', function(opts) {
    console.info('oh hii tag')
    this.on('*', function(evt) {
        console.info('riot', evt)
    })
    this.items = []
    _this = this

    this.render = function(data) {
        console.info(data);
        if(!data ) {
            _this.items = []
            _this.update()
            return
        }

        var cloned = JSON.parse(JSON.stringify(data))
        _this.items = cloned

        var sz = _this.items.length
        for(i = 0; i < sz; i++) {
            var item = _this.items[i]

            item.url = ROOT + 'items/' + item.url
            console.info(item.url)
        }

        _this.update()

    }.bind(this)
});