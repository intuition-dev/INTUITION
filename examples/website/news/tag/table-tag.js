
riot.tag2('table-tag', '<table class="table table-striped table-hover"> <thead> <tr> <th>DATE</th> <th>TITLE</th> <th>DOCUMENT</th> </tr> </thead> <tbody><tr each="{items}"> <td>{field1} <td>{field2}</td> <td><a href="{field3}" target="_blank"> <svg class="feather" viewbox="0 0 24 24"> <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path> </svg></a></td> </td></tr> </tbody> </table>', '', '', function(opts) {
    console.info('oh hi tag')
    this.on('*', function(evt) {
       console.info('riot', evt)
    })
    thiz = this

    this.render = function(data) {
       console.info('ren', data)
       thiz.items = data
       thiz.update()
    }.bind(this)
});