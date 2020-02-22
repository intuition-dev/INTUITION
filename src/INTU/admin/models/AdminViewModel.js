class AdminViewModel {
    constructor(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    setup() {
        this.services = new IntuAPI();
    }
    static inst() {
        return new Promise(function (res, rej) {
            if (AdminViewModel._instance)
                res(AdminViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                AdminViewModel._instance = new AdminViewModel(42);
                AdminViewModel._instance.setup();
                res(AdminViewModel._instance);
            });
        });
    }
    getEditorsList() {
        console.log('getEditorList');
        return this.services.getEditorsList();
    }
    ;
    editEditor(id, name) {
        return this.services.editEditor(id, name);
    }
    ;
    addEditor(guid, name, email, password) {
        return this.services.addEditor(guid, name, email, password);
    }
    ;
    deleteEditor(id) {
        return this.services.deleteEditor(id);
    }
    ;
}
;
