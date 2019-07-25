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
var EditorsViewModel = (function (_super) {
    __extends(EditorsViewModel, _super);
    function EditorsViewModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditorsViewModel.prototype.listF = function () { };
    EditorsViewModel.prototype.openFile = function () { };
    EditorsViewModel.prototype.saveFile = function () { };
    EditorsViewModel.prototype.bakeFile = function () { };
    return EditorsViewModel;
}(BaseViewModel));
