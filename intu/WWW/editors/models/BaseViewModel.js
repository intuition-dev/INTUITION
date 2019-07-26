var BaseViewModel = (function () {
    function BaseViewModel() {
    }
    BaseViewModel.prototype.getData = function () {
        throw new Error('must be implemented by the concrete class');
    };
    BaseViewModel.prototype.validate = function () {
        throw new Error('Not implemented');
    };
    return BaseViewModel;
}());
