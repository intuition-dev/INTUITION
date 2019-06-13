var responces = [];

depp.define({
    'fb': [
        '#polly-core-req', '#firestore'
    ],
    'scripts': [
        '#fb', '#jquery', '#tabulator', '#gridformsJS', ROOT + 'admin/assets/css/spectreBottom.css'
    ],
    'httpRPC': [, '#RPC'],
    'webAdmin': [
        '#scripts', '#httpRPC', ROOT + 'admin/assets/js/adminWebAdmin.js'
    ],
    'general': [
        '#webAdmin', ROOT + 'admin/assets/js/BindEditors.js'
    ],
    'rw': [
        '#general', ROOT + 'admin/assets/js/BindLogin.js', ROOT + 'admin/assets/js/ui.js'
    ],
    'setup-page': [
        '#webAdmin',
        ROOT + 'admin/settings/settings-comp.js',
        ROOT + 'admin/settings/BindSetup.js'
    ],
    'crud': [
        '#rw', ROOT + 'admin/assets/js/crud.js'
    ],
    'fonts': [
        '#crud', 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);