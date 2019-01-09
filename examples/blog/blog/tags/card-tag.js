
riot.tag2('card-tag', '<div class="blog columns blog-preview"><virtual each="{items}"> <virtual if="{publish}"> <div class="blog-item col-4 col-sm-6 col-xs-12"> <div class="blog-item__inside" href="{url}"><a class="img" href="{url}"><img class="img__inside" riot-src="{image}"></a> <div class="desc"> <div class="post-header d-flex"><a class="category" href="#">{category}</a> <div class="share"><a class="icon-wrap" href="https://www.facebook.com/sharer/sharer.php?u=http://liz-blog-seo-test.s3-website-us-east-1.amazonaws.com/{url}" target="_blank"><?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg class="icon__cnt fb"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ei-sc-facebook-icon"><svg id="ei-sc-facebook-icon" viewbox="0 0 50 50" width="100%" height="100%"><path d="M26 20v-3c0-1.3.3-2 2.4-2H31v-5h-4c-5 0-7 3.3-7 7v3h-4v5h4v15h6V25h4.4l.6-5h-5z"></path></svg></use></svg></a><a class="icon-wrap" href="http://twitter.com/share?url=http://liz-blog-seo-test.s3-website-us-east-1.amazonaws.com/{url}" left="0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0" target="_blank"><?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg class="icon__cnt twi"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ei-sc-twitter-icon"><svg id="ei-sc-twitter-icon" viewbox="0 0 50 50" width="100%" height="100%"><path d="M39.2 16.8c-1.1.5-2.2.8-3.5 1 1.2-.8 2.2-1.9 2.7-3.3-1.2.7-2.5 1.2-3.8 1.5-1.1-1.2-2.7-1.9-4.4-1.9-3.3 0-6.1 2.7-6.1 6.1 0 .5.1.9.2 1.4-5-.2-9.5-2.7-12.5-6.3-.5.7-.8 1.7-.8 2.8 0 2.1 1.1 4 2.7 5-1 0-1.9-.3-2.7-.8v.1c0 2.9 2.1 5.4 4.9 5.9-.5.1-1 .2-1.6.2-.4 0-.8 0-1.1-.1.8 2.4 3 4.2 5.7 4.2-2.1 1.6-4.7 2.6-7.5 2.6-.5 0-1 0-1.4-.1 2.4 1.9 5.6 2.9 9 2.9 11.1 0 17.2-9.2 17.2-17.2V20c1.2-.9 2.2-1.9 3-3.2z"></path></svg></use></svg></a><a class="icon-wrap" href="https://www.pinterest.com/pin/create/button/?url=liz-blog-seo-test.s3-website-us-east-1.amazonaws.com/{url}&amp;media={image}" target="_blank" data-pin-shape="round"> <?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg class="icon__cnt"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#ei-sc-pinterest-icon"></use></svg></a></div> </div> <div class="post-body"> <h6 class="title">{title}</h6> </div> <div class="post-footer d-flex"><a class="avatar" href="{url}"><img class="avatar__inside" riot-src="{avatar}"></a> <div class="d-flex"><a class="name" href="{url}">{name}</a> <div class="divider">/</div> <time class="date">{date}</time> </div> </div> </div> </div> </div></virtual> </virtual> </div><br>', '', '', function(opts) {
    console.info('oh hi tag')
    this.on('*', function(evt) {
       console.info('riot', evt)
    })
    this.items = []
    thiz = this

    this.render = function(data) {
       console.info(data)
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

          item.image = ROOT + 'blog/' + item.url + '/who.jpg'
          item.url = ROOT + 'blog/' + item.url
          console.info(item.url)
       }

       thiz.update()

    }.bind(this)
});