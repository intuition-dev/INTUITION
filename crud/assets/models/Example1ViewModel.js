class Example1ViewModel {
    constructor() {
        this.exampleModel = new Example1Model();
    }
    getViewList(table) {
        let _this = this;
        let data;
        return this.read()
            .then(function () {
            switch (table) {
                case 'table1':
                    data = _this.exampleModel._data;
                    break;
                case 'table2':
                    data = [
                        { id: 1, col45: 'Col45', col55: 'Col55' },
                        { id: 1, col45: 'Col45_2', col55: 'Col55_2' }
                    ];
                    break;
            }
            return data;
        })
            .then(function (data) {
            return data;
        });
    }
    getViewForm(formName, id) {
        let _this = this;
        return this.read(id)
            .then(function () {
            return _this.exampleModel._data;
        })
            .then(function (data) {
            console.info("--data:", data);
            return data;
        });
    }
    read(id) {
        return Promise.all([this.exampleModel.read(id)]);
    }
    add(row, cb) {
        this.exampleModel.add(row, cb);
    }
    update(row, cb) {
        this.exampleModel.update(row, cb);
    }
    delete(row) {
        this.exampleModel.delete(row);
    }
    valid(row) {
        return this.exampleModel.valid(row);
    }
}
