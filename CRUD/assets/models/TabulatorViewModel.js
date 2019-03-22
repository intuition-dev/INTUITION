var TabulatorViewModel = (function () {
    function TabulatorViewModel() {
        this._data = [];
        this.dataSourceType = 'fake';
    }
    TabulatorViewModel.prototype.getViewList = function (table) {
        switch (table) {
            case 'example-table':
                console.info("--this._data:", this._data);
                return this._data;
        }
    };
    TabulatorViewModel.prototype.read = function () {
        if (this.dataSourceType == 'fake') {
            var rows = [
                { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
                { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
                { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
                { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
                { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
            ];
            return this._data = [].concat(rows);
        }
    };
    return TabulatorViewModel;
}());
