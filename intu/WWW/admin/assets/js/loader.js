var responces = [];
depp.define({
    'fb': [
        '#poly-core-req', '#firestore'
    ],
    'scripts': [
        '#fb', '#jquery', '#tabulator', '#gridformsJS'
        , '/admin/assets/css/spectreBottom.css'
    ],
    'httpRPC': ['#RPC'],
    'intuAPI': [
        '#scripts','#httpRPC'
        ,'/IntuAPI/IntuAPI.js'
    ],
    'baseVm': ['#intuAPI', '/admin/models/BaseViewModel.js'],
    'general': [
        '#baseVm'
        , '/admin/admin/BindEditors.js'
        , '/admin/models/AdminViewModel.js'
    ],
    'rw': [
        '#general'
        ,'/admin/BindLogin.js'
        , '/admin/models/LoginViewModel.js'
        ,'/admin/assets/js/ui.js'
    ],
    'setup-page': [
        '#intuAPI'
        , '/admin/settings/settings-comp.js'
        , '/admin/settings/BindSettings.js'
        , '/admin/models/SettingsViewModel.js'
    ],
    'fonts': [
        '#crud'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);