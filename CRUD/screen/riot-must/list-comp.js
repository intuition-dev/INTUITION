
riot.tag2('list-comp', '<div class="list-wrapper" id="target" riot-style="column-count:{this.columns}; grid-gap:24px;column-width"></div><yield></yield>', '', '', function(opts) {
    let _this = this
    this.src = opts.src
    this.columns = opts.columns

    var req = new Request(this.src);

    this.on('mount', function(){

       fetch(req)
          .then(function (response) {
             if (response.status === 200) {
                return response.json();
             } else {
                throw new Error('Something went wrong on api server!');
             }
          })
          .then(function (response) {
             let template = document.getElementsByTagName("template")[0]
             let html = $(template).html()

             Mustache.parse(html);
             console.info("--html:", html)

             var rendered = Mustache.render(html, { items: response.items });

             $('#target').html(rendered)
          })
    })
});