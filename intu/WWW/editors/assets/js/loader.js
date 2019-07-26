var responces = [];

depp.define({
    'scripts': [
        '#jquery', '#gridformsJS', '#zebraDate'
        , '/editors/assets/css/spectreBottom.css'
    ],
    'httpRPC': ['#RPC'],
    'intuAPI': [
        '#scripts', '#httpRPC'
        , '/IntuAPI/IntuAPI.js'
    ],
    'baseVm': ['#intuAPI', '/editors/models/BaseViewModel.js'],
    'general': [
        '#baseVm',
        '/editors/edit/BindPosts.js',
        '/editors/BindLogin.js',
    ],
    'rw': [
        '#general',
        '/editors/assets/js/ui.js'
    ],
    'fonts': [
        '#rw'
        , 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);