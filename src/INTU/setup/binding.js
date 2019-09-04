
depp.define({
    'setupViewModel': [
        '/setup/models/SetupViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('setupViewModel');

depp.require(['scripts', 'setupViewModel'], async function() {
    setupViewModel = await SetupViewModel.inst();

    $('.js-btn-delete').on('click', function(){
        deleteTable(setupViewModel);
    });
    
    $('form#setup-config-form').on('submit',function(ev) {
        ev.preventDefault();
        createConfig(this);
    });
});


function createConfig(form, setupViewModel) {
    console.info("--form:", form)
    let serialised = $(form).serializeArray();
    console.info("--serialised:", serialised)
    setupViewModel.createConfig(serialised)
        .then(function(result) {
            if (result) {
                window.location = '/admin';
            }
        })
}

function deleteTable(setupViewModel) {
    setupViewModel.deleteTables()
}