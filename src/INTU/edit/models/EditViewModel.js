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
var EditViewModel = (function (_super) {
    __extends(EditViewModel, _super);
    function EditViewModel() {
        var _this = _super.call(this) || this;
        _this.services = new IntuAPI();
        return _this;
    }
    ;
    EditViewModel.prototype.getDirsList = function () {
        return this.services.getDirsList();
    };
    ;
    EditViewModel.prototype.getSubDirsList = function (id) {
        return this.services.getSubDirsList(id);
    };
    ;
    EditViewModel.prototype.getFile = function (id, pathPrefix) {
        return this.services.getFile(id, pathPrefix);
    };
    ;
    EditViewModel.prototype.saveFile = function (id, md, pathPrefix) {
        return this.services.saveFile(id, md, pathPrefix);
    };
    ;
    EditViewModel.prototype.mbakeCompile = function (id, md, pathPrefix) {
        return this.services.mbakeCompile(id, md, pathPrefix);
    };
    ;
    EditViewModel.prototype.clonePage = function (id, pathPrefix) {
        return this.services.clonePage(id, pathPrefix);
    };
    ;
    EditViewModel.prototype.upload = function (data, pathPrefix) {
        return this.services.upload(data, pathPrefix);
    };
    ;
    EditViewModel.prototype.setPublishDate = function (date, itemPath) {
        return this.services.setPublishDate(date, itemPath);
    };
    ;
    return EditViewModel;
}(BaseViewModel));
