declare var depp: any;

class SetupViewModel extends BaseViewModel {

    services: any;

    constructor(arg) {
        super()
        if (42 !== arg) throw new Error('use static inst()') // guard!
    }

    setup() {
        this.services = new IntuAPI();
    }

    static _instance: SetupViewModel
    static inst(): Promise<SetupViewModel> {
        return new Promise(function (res, rej) {

            if (SetupViewModel._instance) res(SetupViewModel._instance)

            depp.require(['httpRPC', 'intuAPI'], function () {
                SetupViewModel._instance = new SetupViewModel(42);
                SetupViewModel._instance.setup();
                res(SetupViewModel._instance);
            });
        });
    }

    createConfig(form) {
        return this.services.createConfig(form);
    }

    deleteTable() {
        this.services.deleteTables();
    }

}