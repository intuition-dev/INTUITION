console.log('ui loader6')

depp.define({

    'scripts': ['#jquery', '#DOM'],

    'pop-custelX': ['https://cdn.jsdelivr.net/gh/intuition-dev/mbToolBelt@v8.2.1/custel/pop/custel/pop-custel.js'],

    'ui': ['#scripts', '#zebraDate', '#pop-custelX'],

    'codeEdit': ['#codemirror', '#scripts', '//cdn.jsdelivr.net/npm/codemirror@5.48.4/keymap/sublime.js'],
    'cssBot': '/edit/assets/css/spectreBottom.css',

    'httpRPC': ['#RPC'],
    'intuAPI': ['/intuAPI/IntuAPI.js'],
    'baseVM': ['#RPC', '#intuAPI'],
    'loginViewModel': ['#baseVM', '/edit/assets/models/LoginViewModel.js'],
    'editViewModel': ['#baseVM', '/edit/assets/models/EditViewModel.js'],

    'fileUpload': ['#uppy'],
})

depp.require(['ui', 'baseVM'], function() {
    console.log('READY')
    depp.require('cssBot')
})

depp.require('ui', function() {
        console.log('ui')
        $('.user-name').text(sessionStorage.getItem('user_name'));

        $('.datepicker').Zebra_DatePicker();

        // this needs clean up w/ search - replace and api
        $('.site-brand').text(siteName);

        // redirect on not logged in user. 
        let sesName = sessionStorage['username']
        let sesPass = sessionStorage['password']

        if (typeof sesName === 'undefined' ||
            sesName === '' ||
            sesName === null ||
            typeof sesPass === 'undefined' ||
            sesPass === '' ||
            sesPass === null) {

            if (window.location.pathname !== '/edit/loginForm/' && window.location.pathname !== '/edit/loginForm/') {
                console.info('User is not logged in, redirecting to login page ...');
                window.location.replace('/edit/loginForm/')
            }
        } //fi

    }) //depp