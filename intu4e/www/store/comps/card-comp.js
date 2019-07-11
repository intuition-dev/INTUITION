
riot.tag2('card-comp', '<div class="bl-shop-list columns"><virtual each="{item, index in items}"> <div class="column col-4 col-xs-12"> <div class="card"> <div class="bl-shirt-colors"><span class="{color}" each="{color, index in item.colors}"></span></div> <div class="card-image"><a href="{item.url}"><img class="img-responsive" riot-src="{item.url}/{item.image}"></a></div> <div class="card-header"> <div class="card-title h5">{item.title}</div> <div class="card-subtitle text-gray">{item.subtitle}</div> </div> <div class="card-body">{item.desc}</div> <div class="card-footer"><a class="btn btn-primary" href="{item.url}">View</a></div> </div> </div></virtual> </div>', '', '', function(opts) {
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

             item.url = '/items/' + item.url
             console.info(item.url)
       }

       _this.update()

    }.bind(this)
});