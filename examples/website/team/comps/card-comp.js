
riot.tag2('card-comp', '<div class="columns"><virtual each="{items}"> <div class="column col-11 col-lg-12 col-mx-auto"><a class="columns" href="{url}"><virtual if="{rtl}"> <div class="column col-6 col-md-12 l-wrap rtl"> <div class="card-header"> <div class="card-title h5">{cardTitle}</div> <div class="card-subtitle text-gray">{cardSubtitle}</div> </div> <div class="card-image"><img class="img-responsive" riot-src="{image}"></div> </div> <div class="column col-6 col-md-12 r-wrap rtl"> <div class="card-body">{cardBody}</div> </div></virtual > <virtual if="{nortl}"> <div class="column col-6 col-md-12 l-wrap"> <div class="card-header"> <div class="card-title h5">{cardTitle}</div> <div class="card-subtitle text-gray">{cardSubtitle}</div> </div> <div class="card-image"><img class="img-responsive" riot-src="{image}"></div> </div> <div class="column col-6 col-md-12 r-wrap"> <div class="card-body">{cardBody}</div> </div></virtual></a></div></virtual> </div>', 'card-comp .columns,[data-is="card-comp"] .columns{ margin-top: 80px; position: relative; } card-comp > .columns:after { content: \'\'; display: block; position: absolute; top: 0; bottom: 0; left: 50%; width: 6px; background: rgba(0,21,61, .4); } card-comp .column,[data-is="card-comp"] .column{ margin-bottom: 16px; } card-comp a:hover,[data-is="card-comp"] a:hover{ text-decoration: none; } card-comp .l-wrap,[data-is="card-comp"] .l-wrap,card-comp .r-wrap,[data-is="card-comp"] .r-wrap{ padding: 0 5%; } card-comp .l-wrap,[data-is="card-comp"] .l-wrap{ display: flex; align-items: center; justify-content: flex-end; } card-comp .l-wrap.rtl,[data-is="card-comp"] .l-wrap.rtl{ order: 2; justify-content: flex-start; } card-comp .l-wrap.rtl .card-header,[data-is="card-comp"] .l-wrap.rtl .card-header{ order: 2; margin: 0 0 0 20px; } card-comp .l-wrap.rtl .card-image,[data-is="card-comp"] .l-wrap.rtl .card-image{ order: 1; } card-comp .r-wrap.rtl,[data-is="card-comp"] .r-wrap.rtl{ order: 1; text-align: right; } card-comp .card-header,[data-is="card-comp"] .card-header{ flex-shrink: 0; margin-right: 20px; text-align: center; } card-comp .card-image,[data-is="card-comp"] .card-image{ width: 200px; height: 200px; border-radius: 50%; overflow: hidden; border: 4px solid rgba(0,21,61, .3); flex-shrink: 0; } @media (max-width: 960px) { card-comp .card-image { width: 150px; height: 150px; } } @media (max-width: 840px) { card-comp > .columns:after { display: none; } card-comp .l-wrap,[data-is="card-comp"] .l-wrap,card-comp .l-wrap.rtl,[data-is="card-comp"] .l-wrap.rtl{ justify-content: center; margin-bottom: 1rem; } card-comp .columns,[data-is="card-comp"] .columns{ margin-top: 40px; } card-comp .card-body,[data-is="card-comp"] .card-body{ text-align: center; } card-comp .r-wrap.rtl,[data-is="card-comp"] .r-wrap.rtl{ order: 2; } }', '', function(opts) {
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
            item.rtl = item.rtl
            console.info(item.url)
        }

        thiz.update()

    }.bind(this)
});