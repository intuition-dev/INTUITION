var Example1ViewModel = (function () {
    function Example1ViewModel() {
        this._data = [];
        this.dataSourceType = 'real';
        this.exampleModel = new Example1Service();
    }
    Example1ViewModel.prototype.getViewList = function (table) {
        switch (table) {
            case 'table1':
                if (this.dataSourceType == 'fake') {
                    var rows_1 = [
                        { id: 1, col1: " Bob11", col2: "Bob12" },
                        { id: 2, col1: " Bob21", col2: "Bob22" },
                        { id: 3, col1: " Bob31", col2: "Bob32" },
                    ];
                    return rows_1;
                }
                return this._data;
            case 'table2':
                var rows = [
                    { id: 1, col45: 'Col45', col55: 'Col55' },
                    { id: 1, col45: 'Col45_2', col55: 'Col55_2' }
                ];
                return rows;
        }
    };
    Example1ViewModel.prototype.read = function () {
        var _this = this;
        return Promise.all([this.exampleModel.read()])
            .then(function (data) {
            _this._data = [].concat(data[0]);
        });
    };
    return Example1ViewModel;
}());
