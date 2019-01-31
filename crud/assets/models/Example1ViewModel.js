class Example1ViewModel {
    constructor() {
        this.exampleModel = new Example1Model();
    }
    getViewList(table) {
        this.exampleModel.read(table, this.onCB);
    }
    onCB(table, data) {
        table.setData(data);
    }
}
