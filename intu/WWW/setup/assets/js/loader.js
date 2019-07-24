depp.define({
    'scripts': [, '#jquery', '/setup/assets/css/spectreBottom.css'],
    'httpRPC': [, '#RPC',
        '/setup/binding.js',
        '/setup/models/SetupViewModel.js',
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