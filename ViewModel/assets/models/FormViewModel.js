class FormViewModel {
    constructor() {
        this.exampleModel = new Example1EModel();
    }
    getViewForm(formName) {
        return this.exampleModel._dataObj;
    }
    read(id) {
        return Promise.all([this.exampleModel.read(id)]);
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
