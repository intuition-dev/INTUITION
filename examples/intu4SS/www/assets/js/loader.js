depp.define({
    'pre': [
        '#jquery',
        '#RPC'
    ],
    'snipcart': [
        '#pre',
        '/assets/js/ui.js',
        '#snipcartDefaultCss'
    ],
    'css': [
        '#snipcart',
        'css!//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700',
        '/assets/css/style.css'
    ]
});

depp.require(['DOM', 'pre', 'css']);

// TODO: loadSnipCart(key);
loadSnipCart('MjAwOGYyNjAtYTJiOS00ZjgzLThjYmYtYzFjYjY5NDAwYjcxNjM2OTE4MzUyMzc4NzIxNjYx');