declare var depp: any;

class AdminViewModel extends BaseViewModel {

    services: any;

    constructor(arg) {
        super()
        if (42 !== arg) throw new Error('use static inst()') // guard!
    }

    setup() {
        this.services = new IntuAPI();
    }

    static _instance: AdminViewModel
    static inst(): Promise<AdminViewModel> {
        return new Promise(function (res, rej) {

            if (AdminViewModel._instance) res(AdminViewModel._instance)

            depp.require(['httpRPC', 'intuAPI'], function () {
                AdminViewModel._instance = new AdminViewModel(42);
                AdminViewModel._instance.setup();
                res(AdminViewModel._instance);
            });
        });
    }
    
    getEditorsList() {
        return this.services.getEditorsList();
    };

    editEditor(id, name) {
        return this.services.editEditor(id, name);
    };

    addEditor(guid, name, email, password) {
        return this.services.addEditor(guid, name, email, password);
    };

    deleteEditor(id) {
        return this.services.deleteEditor(id);
    };

};