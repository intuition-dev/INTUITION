depp.define({
    'scripts': [, '#jquery', '/assets/css/spectreBottom.css'],
    'httpRPC': [, '#RPC',
        '/assets/js/BindSetup.js',
        '/../IntuAPI/IntuAPI.js',
    ],
    'setup': [
        '#scripts', '#httpRPC'
    ],

    'fonts': [
        '#rw', '#OpenSans'
    ]
});

depp.require(['fonts']);