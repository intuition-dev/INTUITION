var responces = [];

depp.define({
    'scripts': [
        'jquery', 'zebraDate', 'RPC'
        , '/edit/assets/css/spectreBottom.css'
    ],


    'intuAPI': [
        '/intuAPI/IntuAPI.js'
    ],

    'baseVm': ['/edit/models/BaseViewModel.js'],
  
    'ui': [
        '/edit/assets/js/ui.js'
    ],

    'fileUpload': ['uppy'],
  
    'fonts': [
        '#ui'

    ]
});

depp.require(['fonts']);