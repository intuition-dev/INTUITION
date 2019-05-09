
riot.tag2('card-comp', '<div class="columns"><virtual each="{items}"> <div class="column col-4 col-md-6 col-xs-12"><a class="card" href="{url}"> <div class="card-header"> <div class="card-title h5">{cardTitle}</div> <div class="card-subtitle text-gray">{cardSubtitle}</div> </div> <div class="card-image"><img class="img-responsive" riot-src="{image}"></div> <div class="card-body">{cardBody}</div> <div class="card-footer"> <div class="btn-group btn-group-block"> <div class="btn btn-primary">{button}</div> <div class="btn">{button}</div> <div class="btn">{button}</div> </div> </div></a></div> </div></virtual>', 'card-comp .columns,[data-is="card-comp"] .columns{ margin-top: 80px; } card-comp .column,[data-is="card-comp"] .column{ margin-bottom: 16px; } card-comp a:hover,[data-is="card-comp"] a:hover{ text-decoration: none; }', '', function(opts) {
    this.on('*', function(evt) {
        console.info('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data) {
        console.info(data);
        if(!data ) {
            thiz.items = []
            thiz.update()
            return
        }

        var cloned = JSON.parse(JSON.stringify(data))
        thiz.items = cloned

        var sz = thiz.items.length
        for(i = 0; i < sz; i++) {
            var item = thiz.items[i]

            item.image = ROOT + item.url + '/who.jpg'
            item.url = ROOT + item.url
            console.info(item.url)
        }

        thiz.update()

    }.bind(this)
});