declare var depp: any;

class EditViewModel extends BaseViewModel {

    services: any;

    constructor(arg) {
        super()
        if (42 !== arg) throw new Error('use static inst()') // guard!
    }

    setup() {
        this.services = new IntuAPI();
        this.services.DEBUG = true
    }

    static _instance: EditViewModel
    static inst(): Promise<EditViewModel> {
        return new Promise(function (res, rej) {

            if (EditViewModel._instance) res(EditViewModel._instance)

            depp.require(['httpRPC', 'intuAPI'], function () {
                EditViewModel._instance = new EditViewModel(42);
                EditViewModel._instance.setup();
                res(EditViewModel._instance);
            });
        });
    }

    getDirsList() {
        return this.services.getDirsList();
    };

    getSubDirsList(id) {
        return this.services.getSubDirsList(id);
    };

    getFile(id, pathPrefix) {
        return this.services.getFile(id, pathPrefix);
    };

    saveFile(id, md, pathPrefix) {
        return this.services.saveFile(id, md, pathPrefix);
    };

    mbakeCompile(id, md, pathPrefix) {
        return this.services.mbakeCompile(id, md, pathPrefix);
    };

    clonePage(id, pathPrefix) {
        return this.services.clonePage(id, pathPrefix);
    };

    setPublishDate(date, itemPath) {
        return this.services.setPublishDate(date, itemPath);
    };

}