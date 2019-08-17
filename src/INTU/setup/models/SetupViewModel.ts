

class SetupViewModel extends BaseViewModel {

    services

    constructor() {
        super()
        this.services = new IntuAPI()
    }

    createConfig(form) {
        return this.services.createConfig(form);
    }

    deleteTable() {
        this.services.deleteTables();
    }

}