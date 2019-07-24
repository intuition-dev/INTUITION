var AdminViewModel = (function () {
    function AdminViewModel() {
        this.services = new IntuAPI();
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
}());
;
