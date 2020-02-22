class EditViewModel {
    constructor(arg) {
        if (42 !== arg)
            throw new Error('use static inst()');
    }
    async setup() {
        this.services = new IntuAPI();
    }
    static inst() {
        return new Promise(function (res, rej) {
            if (EditViewModel._instance)
                res(EditViewModel._instance);
            depp.require(['httpRPC', 'intuAPI'], function () {
                EditViewModel._instance = new EditViewModel(42);
                EditViewModel._instance.setup();
                res(EditViewModel._instance);
            });
        });
    }
    getDirsList() {
        return this.services.getDirsList();
    }
    ;
    getSubDirsList(id) {
        return this.services.getSubDirsList(id);
    }
    ;
    getFile(id, pathPrefix) {
        return this.services.getFile(id, pathPrefix);
    }
    ;
    saveFile(id, md, pathPrefix) {
        return this.services.saveFile(id, md, pathPrefix);
    }
    ;
    mbakeCompile(id, md, pathPrefix) {
        return this.services.mbakeCompile(id, md, pathPrefix);
    }
    ;
    clonePage(id, pathPrefix) {
        return this.services.clonePage(id, pathPrefix);
    }
    ;
    setPublishDate(date, itemPath) {
        return this.services.setPublishDate(date, itemPath);
    }
    ;
}
