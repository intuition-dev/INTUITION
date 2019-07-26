
class EditViewModel extends BaseViewModel {
    
    services: any;

    constructor() {
        super()
        this.services = new IntuAPI();
    };
    
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

    upload(data, pathPrefix) {
        return this.services.upload(data, pathPrefix);
    };

    setPublishDate(date, itemPath) {
        return this.services.setPublishDate(date, itemPath);
    };
    
}