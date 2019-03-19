var TabulatorViewModel = (function () {
    function TabulatorViewModel() {
        this._data = [];
        this.dataSourceType = 'real';
        this.exampleModel = new TabulatorService();
    }
    TabulatorViewModel.prototype.getViewList = function (table) {
        switch (table) {
            case 'table1':
                if (this.dataSourceType == 'fake') {
                    var rows = [
                        { id: 1, col1: " Bob11", col2: "Bob12" },
                        { id: 2, col1: " Bob21", col2: "Bob22" },
                        { id: 3, col1: " Bob31", col2: "Bob32" },
                    ];
                    return rows;
                }
                return this._data;
        }
    };
    TabulatorViewModel.prototype.read = function () {
        var _this = this;
        return Promise.all([this.exampleModel.read()])
            .then(function (data) {
            _this._data = [].concat(data[0]);
        });
    };
    return TabulatorViewModel;
}());
