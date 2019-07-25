var BaseViewModel = (function () {
    function BaseViewModel() {
    }
    BaseViewModel.prototype.getData = function () {
        throw new Error('must be implemented by the concrete class');
    };
    BaseViewModel.prototype.validate = function () {
        throw new Error('Not implemented');
    };
    BaseViewModel.prototype.log = function () {
        var a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            a[_i] = arguments[_i];
        }
        throw new Error('Not implemented');
    };
    return BaseViewModel;
}());
