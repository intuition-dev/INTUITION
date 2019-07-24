
class AdminViewModel  {

    services: any;

    constructor() {
        this.services = new IntuAPI();
    };
    
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