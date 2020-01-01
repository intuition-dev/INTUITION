var AdminViewModel = (function () {
    function AdminViewModel(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    AdminViewModel.prototype.setup = function () {
        this.services = new IntuAPI();
    };
    AdminViewModel.inst = function () {
        return new Promise(function (res, rej) {
            if (AdminViewModel._instance)
                res(AdminViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                AdminViewModel._instance = new AdminViewModel(42);
                AdminViewModel._instance.setup();
                res(AdminViewModel._instance);
            });
        });
    };
    AdminViewModel.prototype.getEditorsList = function () {
        console.log('getEditorList');
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
