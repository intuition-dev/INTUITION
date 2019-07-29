console.log("TCL: window.apiPort", window.apiPort)
class BindSetup {
    constructor() {
        this.setupViewModel = new SetupViewModel()
    }

    createConfig(form) {
        console.info("--form:", form)
        let serialised = $(form).serializeArray();
        console.info("--serialised:", serialised)
        this.setupViewModel.createConfig(serialised)
            .then(function(result) {
                if (result) {
                    window.location = '/admin';
                }
            })
    }

    deleteTable() {
        this.setupViewModel.deleteTables()
    }
}