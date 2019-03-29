class TabulatorVMTest {
   test1() {
      QUnit.test('got the data for the TabulatorViewModel', function (assert) {
         var viewModel = new TabulatorViewModel()


         var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
               resolve(viewModel.read())
            }, 300);
         }).then(function () {
            let data = viewModel.getViewList('example-table')
            assert.ok(data.length, 'there is some data');
         });

         return promise;
      });
   }
   test2() {
      QUnit.test('got the data for the FormViewModel', function (assert) {
         var viewModel = new FormViewModel()


         var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
               resolve(viewModel.read('1'))
            }, 500);
         }).then(function () {
            let data = viewModel.getViewForm('form1')
            assert.ok(data, 'got the object for the form');
         });

         return promise;
      });
   }
   test3() {
      QUnit.test('got the data for the FormViewModel with wrong form Id, should give an error', function (assert) {
         var viewModel = new FormViewModel()


         var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
               resolve(viewModel.read('1'))
            }, 500);
         }).then(function () {
            let data = viewModel.getViewForm('form2')
            assert.ok(data, 'there is no such form id');
         });

         return promise;
      });
   }
}

