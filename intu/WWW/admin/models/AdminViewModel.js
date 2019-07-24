"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var BaseViewModel_1 = require("./BaseViewModel");
var AdminViewModel = (function (_super) {
    __extends(AdminViewModel, _super);
    function AdminViewModel() {
        var _this = _super.call(this) || this;
        _this.services = new IntuAPI();
        return _this;
    }
    ;
    AdminViewModel.prototype.getEditorsList = function () {
        return this.services.getEditorsList();
    };
    ;
    AdminViewModel.prototype.editEditor = function (id, name) {
        return this.services.editEditor(id, name);
    };
    ;
    AdminViewModel.prototype.addEditor = function (guid, name, email, password) {
        return this.services.addEditor(guid, name, email, password);
    };
    ;
    AdminViewModel.prototype.deleteEditor = function (id) {
        return this.services.deleteEditor(id);
    };
    ;
    return AdminViewModel;
}(BaseViewModel_1.BaseViewModel));
;
