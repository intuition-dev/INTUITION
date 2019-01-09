
riot.tag2('feed-tag', '<div class="cards"><virtual each="{items}"><a class="flex edge item" href="{url}"> <div class="left"><img class="cardImg" riot-src="{image}"></div> <div class="right"> <div class="cardInfo"> <h4>{content_text}<br> <div><br><img class="circImgSmall" riot-src="{author.avatar}"></div> <div> <h6>{author.name}</h6> </div> </h4> </div> </div></a></virtual></div><br>', 'feed-tag .cards,[data-is="feed-tag"] .cards{ display: flex; flex-wrap: wrap; justify-content: center; align-content: flex-start; } feed-tag .cards:after,[data-is="feed-tag"] .cards:after{ content: \'\'; width: 600px; } feed-tag .cardImg,[data-is="feed-tag"] .cardImg{ max-width: 400px ; height: 300px ; object-fit: cover; overflow: hidden; } feed-tag .cardInfo,[data-is="feed-tag"] .cardInfo{ padding: 15px; } feed-tag .item,[data-is="feed-tag"] .item{ width: 600px; height: 300px ; margin: 10px; overflow: hidden; background: white; border-style: outset; border-width: .05px; border-color: #DCDCDC; }', '', function(opts) {
    console.info('oh hi tag')
    this.on('*', function(evt) {

    })
    this.items = []
    thiz = this

    this.render = function(data) {
       if(!data ) {
          thiz.items = []
          thiz.update()
          return
       }
       console.info(Object.keys(data[0]))

       let cloned = JSON.parse(JSON.stringify(data))
       thiz.items = cloned

      let sz = thiz.items.length
      for(i = 0; i < sz; i++) {
          var item = thiz.items[i]
          item.url = ROOT + 'blog/' + item.url
          if (item.image.indexOf('//')==-1)
              item.image = item.url + '/' + item.image

          console.info(item.url)
       }

       thiz.update()

    }.bind(this)
});