depp.define({
    'pre': [
        '#jquery',
        '#RPC',
        '/sapi/sapi.js',
    ],
    'popup': [
        '#jquery', '#bsjs', '#gridformsDefaultStyle', '#gridformsJS'
    ],
    'css': [
        'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
        '/assets/css/style.css'
    ]
});

depp.require(['DOM', 'pre', 'css']);