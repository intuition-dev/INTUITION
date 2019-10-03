
depp.define({
    'setupViewModel': [
        '/setup/models/SetupViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('setupViewModel');

depp.require(['scripts', 'setupViewModel', 'DOMDelayed'], async function () {
    setupViewModel = await SetupViewModel.inst();

    $('form#setup-config-form').on('submit', function (ev) {
        console.log("TCL: ev", ev)
        ev.preventDefault();
        createConfig(this, setupViewModel);
    });
});


function createConfig(form, setupViewModel) {
    console.info("--form:", form)
    let serialised = $(form).serializeArray();
    console.info("--serialised:", serialised)
    setupViewModel.createConfig(serialised)
        .then(function (result) {
            if (result) {
                window.location = '/admin';
            }
        })
}
