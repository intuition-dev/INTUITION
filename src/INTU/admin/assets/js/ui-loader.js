var responces = [];
depp.define({
    'scripts': [
        '#jquery', '#tabulator', '#gridformsJS'
        , '/admin/assets/css/spectreBottom.css'
    ],
    'httpRPC': ['#RPC'],
    'intuAPI': [
        '/intuAPI/IntuAPI.js'
    ],
    'baseVm': ['/admin/models/BaseViewModel.js'],
    'ui': [
        '/admin/assets/js/ui.js'
    ],
    'setup-page': [
        '/admin/settings/settings-comp.js'
    ],
    'fonts': [
        '#ui',
        '#scripts',
        'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);