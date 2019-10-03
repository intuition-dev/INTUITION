depp.define({
    'scripts': ['#jquery', '/setup/assets/css/spectreBottom.css'],
    'baseVm': ['/setup/models/BaseViewModel.js'],
    'httpRPC': ['https://cdn.jsdelivr.net/gh/intuition-dev/toolBelt@v1.9.29/http-rpc+/web/httpRPC.js'],
    'intuAPI': [
        '/intuAPI/IntuAPI.js'
    ],
    'fonts': [
        'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);