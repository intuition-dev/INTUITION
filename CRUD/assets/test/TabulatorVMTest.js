QUnit.test('got the data for the view', function (assert) {
   var viewModel = new TabulatorViewModel()
   var thenable = Promise.all([viewModel.read()])
      .then(function () {
         let data = viewModel.getViewList('example-table')
         assert.ok(data.length, 'there is some data');
      })
   return thenable;
});
