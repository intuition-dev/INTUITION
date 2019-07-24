class SetupViewModel {

    services: any;

    constructor() {
        this.services = new IntuAPI();
    };

    createConfig(form) {
        return this.services.createConfig(form);
    };

    deleteTable() {
        this.services.deleteTables();
    };

}