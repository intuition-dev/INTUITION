class MustacheBind {
   constructor() {
      this.mustacheViewModel = new MustacheViewModel()
   }

   getViewList(blockId) {
      var _this = this

      Promise.all([this.mustacheViewModel.read()])
         .then(function () {
            var data = _this.mustacheViewModel.getViewList(blockId)
            _this.getTemplate(data, blockId)
         })
   }

   getTemplate(data, blockId) {
      var template = $('#template').html();
      Mustache.parse(template);   // optional, speeds up future uses
      var rendered = Mustache.render(template, { data: data });
      $('#' + blockId).html(rendered)
   }
}