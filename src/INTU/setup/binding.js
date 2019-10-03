
depp.define({
    'setupViewModel': [
        '/setup/models/SetupViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('setupViewModel');

depp.require(['scripts', 'setupViewModel'], async function () {
    setupViewModel = await SetupViewModel.inst();

    $('.js-btn-setup').off('click').on('click', function (ev) {
        alert('hey')
        console.log("TCL: ev", ev)
        ev.preventDefault();
        // createConfig(this, setupViewModel);
    });
});


function createConfig(form, setupViewModel) {
    console.info("--form:", form)
    let serialised = $(form).serializeArray();
    console.info("--serialised:", serialised)
    // setupViewModel.createConfig(serialised)
    //     .then(function(result) {
    //         if (result) {
    //             window.location = '/admin';
    //         }
    //     })
}
