depp.define({
    'pre': [
        '#jquery',
        '#RPC'
    ],
    'ui': [
        '#pre',
        '/assets/js/ui.js'
    ],
    'css': [
        '#ui',
        'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
        '/assets/css/style.css'
    ]
});

depp.require(['DOM', 'pre', 'css']);