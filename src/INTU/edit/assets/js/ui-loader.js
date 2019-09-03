var responces = [];

depp.define({
    'scripts': [
        '#jquery', '#gridformsJS', '#zebraDate'
        , '/edit/assets/css/spectreBottom.css'
    ],
    'httpRPC': ['#RPC'],
    'intuAPI': [
        '/intuAPI/IntuAPI.js'
    ],
    'baseVm': ['/edit/models/BaseViewModel.js'],
    'general': [
        '#baseVm',
        '/edit/edit/bindPosts.js',
        '/edit/models/EditViewModel.js'
    ],
    'ui': [
        '/edit/assets/js/ui.js'
    ],
    'fonts': [
        '#rw'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);