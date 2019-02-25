var FormViewModel = (function () {
    function FormViewModel() {
        this._dataObj = {};
        this.dataSourceType = 'real';
        this.exampleModel = new Example1Service();
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
        return this.exampleModel.add(row)
            .then(function () {
            window.location.replace('/screen/example1');
        });
    };
    FormViewModel.prototype.update = function (row, cb) {
        return this.exampleModel.update(row, cb)
            .then(function (id) {
            console.log('document with', id, 'was updated');
        });
    };
    FormViewModel.prototype.delete = function (row) {
        this.exampleModel.delete(row)
            .then(function (id) {
            window.location.replace('/screen/example1');
        });
    };
    FormViewModel.prototype.valid = function (row) {
        return this.exampleModel.valid(row);
    };
    return FormViewModel;
}());
