var MustacheViewModel = (function () {
    function MustacheViewModel() {
        this._data = [];
        this.dataSourceType = 'real';
    }
    MustacheViewModel.prototype.getViewList = function (div) {
        switch (div) {
            case 'target':
                return this._data;
        }
    };
    MustacheViewModel.prototype.read = function () {
        var _this = this;
        var url = 'https://newsapi.org/v2/top-headlines?' +
            'sources=bbc-news&' +
            'apiKey=c75812bea33d40efb539400d39f99c32';
        var req = new Request(url);
        return fetch(req)
            .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
            else {
                throw new Error('Something went wrong on api server!');
            }
        })
            .then(function (response) {
            _this._data = [].concat(response.articles);
            console.info("--response.articles:", response);
            return;
        });
    };
    return MustacheViewModel;
}());
