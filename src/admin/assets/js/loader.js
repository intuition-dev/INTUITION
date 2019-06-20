var responces = [];
            console.log("TCL: location.port", location.port)
            console.log("TCL: location.protocol", location.protocol.split(':')[0])
            console.log("TCL: location.hostname", location.hostname)
depp.define({
    'fb': [
        '#polly-core-req', '#firestore'
    ],
    'scripts': [
        '#fb', '#jquery', '#tabulator', '#gridformsJS', ROOT + 'admin/assets/css/spectreBottom.css'
    ],
    'httpRPC': ['#RPC'],
    'intuAPI': [
        '#scripts',
        '#httpRPC',
        ROOT + 'IntuAPI/IntuAPI.js'
    ],
    'general': [
        '#intuAPI', ROOT + 'admin/assets/js/BindEditors.js'
    ],
    'rw': [
        '#general', ROOT + 'admin/assets/js/BindLogin.js', ROOT + 'admin/assets/js/ui.js'
    ],
    'setup-page': [
        '#intuAPI',
        ROOT + 'admin/settings/settings-comp.js',
        ROOT + 'admin/settings/BindSettings.js'
    ],
    'crud': [
        '#rw', ROOT + 'admin/assets/js/crud.js'
    ],
    'fonts': [
        '#crud', 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);