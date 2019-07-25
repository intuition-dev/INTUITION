var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SetupViewModel = (function (_super) {
    __extends(SetupViewModel, _super);
    function SetupViewModel() {
        var _this = _super.call(this) || this;
        _this.services = new IntuAPI();
        return _this;
    }
    SetupViewModel.prototype.createConfig = function (form) {
        return this.services.createConfig(form);
    };
    SetupViewModel.prototype.deleteTable = function () {
        this.services.deleteTables();
    };
    return SetupViewModel;
}(BaseViewModel));
