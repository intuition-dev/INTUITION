var FormViewModel = (function () {
    function FormViewModel() {
        this._dataObj = {};
        this.dataSourceType = 'real';
        this.exampleModel = new TabulatorService();
    }
    FormViewModel.prototype.getViewForm = function (formName) {
        if (this.dataSourceType == 'fake') {
            var row = { id: 1, col1: " Bob11", col2: "Bob12" };
            return row;
        }
        return this._dataObj;
    };
    FormViewModel.prototype.read = function (id) {
        var _this = this;
        return Promise.all([this.exampleModel.read(id)])
            .then(function (data) {
            Object.assign(_this._dataObj, data[0]);
        });
    };
    FormViewModel.prototype.add = function (row, cb) {
        return this.exampleModel.add(row);
    };
    FormViewModel.prototype.update = function (row, cb) {
        return this.exampleModel.update(row, cb);
    };
    FormViewModel.prototype.delete = function (row) {
        return this.exampleModel.delete(row);
    };
    FormViewModel.prototype.valid = function (row) {
        var col1 = row['col1'];
        var col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    };
    return FormViewModel;
}());
