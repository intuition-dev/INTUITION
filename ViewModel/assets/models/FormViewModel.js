class FormViewModel {
    constructor() {
        this._dataObj = {};
        this.dataSourceType = 'real';
        this.exampleModel = new Example1Service();
    }
    getViewForm(formName) {
        if (this.dataSourceType == 'fake') {
            let row = { id: 1, col1: " Bob11", col2: "Bob12" };
            return row;
        }
        return this._dataObj;
    }
    read(id) {
        let _this = this;
        return Promise.all([this.exampleModel.read(id)])
            .then(function (data) {
            Object.assign(_this._dataObj, data[0]);
        });
    }
    add(row, cb) {
        return this.exampleModel.add(row)
            .then(function () {
            window.location.replace('/screen/example1');
        });
    }
    update(row, cb) {
        return this.exampleModel.update(row, cb)
            .then(function (id) {
            console.log('document with', id, 'was updated');
        });
    }
    delete(row) {
        this.exampleModel.delete(row)
            .then(function (id) {
            window.location.replace('/screen/example1');
        });
    }
    valid(row) {
        return this.exampleModel.valid(row);
    }
}
