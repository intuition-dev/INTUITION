var responces = [];

depp.define({
    'scripts': [, '#jquery', '#gridformsJS', '#zebraDate', ROOT + 'editors/assets/css/spectreBottom.css'],
    'httpRPC': [, '#RPC'],
    'webAdmin': [
        '#scripts', '#httpRPC', ROOT + 'IntuAPI/IntuAPI.js'
    ],
    'edit': [
        '#webAdmin',
        ROOT + 'editors/assets/js/edit.js'
    ],
    'general': [
        '#edit', ROOT + 'editors/assets/js/BindPosts.js', ROOT + 'editors/assets/js/login.js'
    ],
    'rw': [
        '#general',
        ROOT + 'editors/assets/js/ui.js'
    ],
    'fonts': [
        '#rw', 'css!//fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i'
    ]
});

depp.require(['fonts']);