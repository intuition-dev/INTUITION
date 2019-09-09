
depp.define({
    'scripts': [
        'jquery',
        , '/edit/assets/css/spectreBottom.css'
    ],
    'ui': [ 'scripts',  'zebraDate', 
        'custel'
    ],

    'codeEdit': [ 'codemirror', '#scripts',
        '//cdn.jsdelivr.net/npm/codemirror@5.48.0/keymap/sublime.js'
    ],

    'intuAPI': [
        '/intuAPI/IntuAPI.js'
    ],
    'baseVm': ['RPC', 'intuAPI', '/edit/models/BaseViewModel.js',  ],
    'loginViewModel': [ '#baseVM',
        '/edit/models/LoginViewModel.js'
    ],
    'editViewModel': ['#baseVM',
        '/edit/models/EditViewModel.js'
    ],

    'fileUpload': ['uppy'],
})

depp.require(['baseVm', 'ui'])

depp.require('ui', function() {
    $('.user-name').text(sessionStorage.getItem('user_name'));

    $('.datepicker').Zebra_DatePicker();

    $('.site-brand').text(siteName);

    // redirect on not logged in user
    let sesName = sessionStorage['username'];
    let sesPass = sessionStorage['password'];

    if (typeof sesName === 'undefined'
        || sesName === ''
        || sesName === null
        || typeof sesPass === 'undefined'
        || sesPass === ''
        || sesPass === null) {

            if (window.location.pathname !== '/edit/logonForm' && window.location.pathname !== '/edit//edit/logonForm') {
                console.info('User is not logged in, redirecting to login page ...');
                window.location.replace('/edit')
            }
    }//fi

})//depp