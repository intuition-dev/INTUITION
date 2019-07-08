console.log("TCL: window.apiPort", window.apiPort)
class BindSetup {
    constructor() {
        this.services = new IntuAPI()
    }

    createConfig(form) {
        console.info("--form:", form)
        let serialised = $(form).serializeArray();
        console.info("--serialised:", serialised)
        this.services.createConfig(serialised)
            .then(function(result) {
                if (result) {
                    window.location = '/admin';
                }
            })
    }

    deleteTable() {
        this.services.deleteTables()
    }
}