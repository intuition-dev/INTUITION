class Example1ViewModel {
    constructor() {
        this.exampleModel = new Example1EModel();
    }
    getViewList(table) {
        let _this = this;
        let data;
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
    }
    read(id) {
        return Promise.all([this.exampleModel.read()]);
    }
}
