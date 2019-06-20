if (window.location.href.indexOf('editors/edit') > -1) {

    depp.define({
        'codeEdit': [
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.css', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/theme/solarized.css'

            , '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.min.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/markdown/markdown.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/yaml/yaml.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/pug/pug.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/css/css.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/keymap/sublime.js'

        ]
    });

    depp.require('codeEdit', pgInit);

    function pgInit() {
        _initCodeMirror();
    };

    var myCodeMirror;

    function _initCodeMirror(mode) {

        if (typeof myCodeMirror !== 'undefined') {

            myCodeMirror.toTextArea();

        }
        myCodeMirror = CodeMirror.fromTextArea(
            document.querySelector('#cms1'), {
                mode: mode || 'markdown',
                lineNumbers: true,
                tabSize: 3,
                indentWithTabs: false,
                v11iewportMargin: 'Infinity',
                lineWrapping: true
            }
        )
        myCodeMirror.setSize('100%', '100%');

    } // initCM();


    depp.require(['general'], function() {

        $(document).on('click', '.js-view-page', function(e) {

            if ($(this).hasAttribute('disabled')) {
                e.preventDefault();
            }

        });

        let posts = new Posts();
        let hash = window.location.hash.substr(1);;
        console.info("--hash:", hash)

        posts
            .showDirs()
            .then(() => {

                if (typeof hash !== 'undefined' && hash !== '') {

                    let currentPage = $('.blog-item:contains("' + hash + '")');
                    console.log('currentPage', currentPage);

                    $('.blog-item ul').remove();
                    $('.upload, .i-plusCircle').removeClass('disabled');
                    $('.knot').removeClass('active');
                    $(currentPage).find('.knot').addClass('active');
                    $('.blog-item').removeClass('active');
                    $(currentPage).addClass('active');
                    $('.btn-custom.save').attr("disabled", "disabled");
                    $('.js-view-page').removeAttr("disabled");

                    let postId = $(currentPage).find('span').text();

                    $('.js-view-page').attr('href', appMount + '/' + postId);

                    if ($(currentPage).find('ul').length === 0) {
                        posts
                            .showSubDirs(postId)
                            .then(() => {
                                $('.blog-item li').each(function() {

                                    let fileName = $(this).text();

                                    if (fileName.includes('.md')) {
                                        $(this).addClass('md-highlight');
                                    }

                                    if (fileName.includes('.md') || fileName.includes('.yaml') || fileName.includes('.css') || fileName.includes('.pug') || fileName.includes('.csv')) {
                                        $(this).addClass('hover-highlight');
                                    }

                                });
                            });
                    } else {
                        $(this).find('ul').remove();
                    }

                }

            });


        let appMount = window.appMount;
        console.info('appmoutn', appMount);

        $('.js-view-page').attr('href', appMount);

        /*
         * show sub directories
         */
        $(document).off().on('click', '.blog-item', function(e) {

            e.preventDefault();

            $('.blog-item ul').remove();
            $('.upload, .i-plusCircle').removeClass('disabled');
            $('.knot').removeClass('active');
            $(this).find('.knot').addClass('active');
            $('.blog-item').removeClass('active');
            $(this).addClass('active');
            $('.btn-custom.save').attr("disabled", "disabled");
            $('.js-view-page').removeAttr("disabled");

            let postId = $(this).find('span').text();

            window.location.hash = postId;

            $('.js-view-page').attr('href', appMount + '/' + postId);

            if ($(this).find('ul').length === 0) {
                posts
                    .showSubDirs(postId)
                    .then(() => {
                        $('.blog-item li').each(function() {

                            let fileName = $(this).text();

                            if (fileName.includes('.md')) {
                                $(this).addClass('md-highlight');
                            }

                            if (fileName.includes('.md') || fileName.includes('.yaml') || fileName.includes('.css') || fileName.includes('.pug') || fileName.includes('.csv')) {
                                $(this).addClass('hover-highlight');
                            }

                        });
                    });
            } else {
                $(this).find('ul').remove();
            }

        });

        /*
         * Refresh directiories
         */
        $(document).on('click', '.icono-sync', function(e) {

            e.preventDefault();

            if ($('.blog-item').hasClass('active')) {

                window.refreshActiveFolder = $('.blog-item.active').find('span').text();
                window.refreshActiveFile = $('.blog-item.active li.active div').text();
                $('.loader').addClass('active');
                $('.blog-list-wrap').html('');

                // re-render dirs
                posts
                    .showDirs()
                    .then(() => {

                        $('.blog-list-wrap').find('.blog-item span:contains(' + refreshActiveFolder + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + refreshActiveFile + ')').addClass('active').click();

                        setTimeout(function() {
                            $('.blog-item.active ul li:contains(' + refreshActiveFile + ')').addClass('active').click();
                            $('.loader').removeClass('active');
                        }, 1000);


                    });

            } else {

                // re-render dirs
                $('.loader').addClass('active');
                $('.blog-list-wrap').html('');

                posts
                    .showDirs()
                    .then(() => $('.loader').removeClass('active'));

            }
        });

        /*
         * show file contents
         */
        $(document).on('click', '.blog-item li', function(e) {

            e.preventDefault();
            e.stopPropagation(); // prevent child trigger click on parent

            let postId = $(this).text();
            console.log("TCL: postId", postId)
            let mdFile = '.md';
            let datFile = 'dat.yaml';
            let gloFile = 'GLO.yaml';
            let csvFile = '.csv';
            let cssFile = '.css';

            if (postId.includes(mdFile) || postId.includes(datFile) || postId.includes(gloFile) || postId.includes(csvFile) || postId.includes(cssFile)) {

                switch (true) {
                    case postId.includes(mdFile):
                        _initCodeMirror('markdown');
                        break;
                    case postId.includes(datFile):
                        _initCodeMirror('yaml');
                        break;
                    case postId.includes(gloFile):
                        _initCodeMirror('yaml');
                        break;
                    case postId.includes(csvFile):
                        _initCodeMirror('csv');
                        break;
                    case postId.includes(cssFile):
                        _initCodeMirror('css');
                        break;
                    case postId.includes(cssFile):
                        _initCodeMirror('css');
                        break;
                    default:
                        _initCodeMirror('text');
                }

                $('.blog-item li').removeClass('active');
                $(this).addClass('active');

                let pathPrefix = $(this).parents('.blog-item').find('span').text();
                let editedFileName = postId.replace('/', '');

                $('.js-file-name').text(editedFileName);

                posts.showMd(postId, pathPrefix);

                $('.btn-custom.save').removeAttr("disabled");
                $('.i-calendar').addClass('disabled');

                if (postId.includes(datFile)) {
                    $('.i-calendar').removeClass('disabled');
                }
            }

            // enable pug file edit
            if ($('.js-enable-pug').hasClass('js-pug-enabled')) {
                let pugFile = '.pug';

                if (postId.includes(pugFile)) {

                    _initCodeMirror('pug');

                    $('.blog-item li').removeClass('active');
                    $(this).addClass('active');

                    let pathPrefix = $(this).parents('.blog-item').find('span').text();
                    let editedFileName = postId.replace('/', '');

                    $('.js-file-name').text(editedFileName);

                    posts.showMd(postId, pathPrefix);

                    $('.btn-custom.save').removeAttr("disabled");
                    $('.i-calendar').addClass('disabled');

                }

            }

        });

        /*
         * save file
         */
        $(document).on('click', '.save', function(e) {

            e.preventDefault();

            let postId = $('.blog-item.active').find('li.active').text();
            let pathPrefix = $('.blog-item.active').find('span').text();
            let md = myCodeMirror.getValue();

            $(this).attr("disabled", "disabled");
            $('.loader').addClass('active');

            posts
                .saveMd(postId, md, pathPrefix)
                .then(() => {

                    $(this).removeAttr("disabled");
                    $('.loader').removeClass('active');
                    $('.notification').removeClass('d-hide').find('.text').text('The content was successfully updated');

                    setTimeout(function() {
                        $('.notification').addClass('d-hide').find('.text').text('');
                    }, 2000);
                    console.info('saved');

                })
                .then(() => {
                    posts
                        .compile(postId, md, pathPrefix)
                        .then((response) => {
                            if (response == 'OK') {

                                let msg = 'Files have been built';

                                $('[data-js="errors"]').removeClass('toast-error d-hide').html(msg);

                                setTimeout(function() {
                                    $('[data-js="errors"]').addClass('d-hide toast-error').html('');
                                }, 4000);

                            } else {

                                var msg = response.msg + ' in ' + response.filename + ' at line ' + response.line + '<br />'
                                $('[data-js="errors"]').html(msg);
                                $('[data-js="errors"]').removeClass('d-hide');

                            }
                            console.info('build');
                        });
                });

        });

        /*
         * clone page
         */
        // clone page form show/hide
        $(document).on('click', '.create-post', function(e) {

            e.preventDefault();
            e.stopPropagation();

            if (!($(this).hasClass('disabled'))) {

                $('form').addClass('d-hide');
                $('.post-name-wrap').removeClass('d-hide');
                $('.icon-wrap i').removeClass('active');
                $('.icon-wrap .create-post').addClass('active');

            }

        });

        $(window).click(function() {
            $('.post-name-wrap').addClass('d-hide');
        });

        $('.post-name-wrap').click(function(event) {
            event.stopPropagation();
        });

        // clone page form submit
        $('.post-name-wrap').on('submit', function(e) {

            e.preventDefault();

            let postId = $(this).find('input').val();
            let pathPrefix = $('.blog-item.active').find('span').text();


            if (pathPrefix === '') {

                $('.notification').removeClass('d-hide').addClass('error-msg').find('.text').text('Please select a page to copy');

                setTimeout(function() {
                    $('.notification').addClass('d-hide').removeClass('error-msg').find('.text').text('');
                }, 4000);

            } else if (postId === '') {

                $('.notification').removeClass('d-hide').addClass('error-msg').find('.text').text('Page name can\'t be blank');

                setTimeout(function() {
                    $('.notification').addClass('d-hide').removeClass('error-msg').find('.text').text('');
                }, 4000);

            } else {

                $(this).attr("disabled", "disabled");
                $('.loader').addClass('active');

                // add post
                posts
                    .addPost(postId, pathPrefix)
                    .then(() => {

                        $(this).removeAttr("disabled");
                        $('.loader').removeClass('active');

                        $('.notification').removeClass('d-hide').find('.text').text('New post was added, now you can edit the content');

                        setTimeout(function() {
                            $('.notification').addClass('d-hide').find('.text').text('');
                        }, 4000);

                        $('.post-name-wrap').addClass('d-hide').find('input').val('');
                        $('.create-post').removeClass('active');

                    });


                // re-render dirs
                $('.blog-list-wrap').html('');

                posts
                    .showDirs()
                    .then(() => {

                        $('.blog-list-wrap').find('.blog-item span:contains(' + postId + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

                        setTimeout(function() {
                            $('.blog-item.active ul li:contains(\'.md\')').addClass('active').click();
                        }, 1000);

                    });
            }

        });

        /*
         * File upload
         */
        $(document).on('click', '.upload', function(e) {

            e.preventDefault();
            e.stopPropagation();

            if (!($(this).hasClass('disabled'))) {

                $('form').addClass('d-hide');
                $('.file-upload').removeClass('d-hide');
                $('.icon-wrap i').removeClass('active');
                $('.icon-wrap .upload').addClass('active');

                window.pathPrefixUpload = $('.blog-item.active').find('span').text();

            }

        });

        $(window).click(function() {

            $('.file-upload').addClass('d-hide');
            $('.icon-wrap i').removeClass('active');

        });

        $('.file-upload').click(function(event) {
            event.stopPropagation();
        });

        $('#file-upload').on('submit', function(e) {

            e.preventDefault();

            $(this).attr("disabled", "disabled");
            $('.loader').addClass('active');

            let input = $('#file-upload-input')[0].files[0];

            posts
                .uploadFile(input, pathPrefixUpload)
                .then(() => {

                    $(this).removeAttr("disabled");
                    $('.loader').removeClass('active');
                    $('.file-upload').addClass('d-hide');
                    $('.notification').removeClass('d-hide').find('.text').text('The file was successfully uploaded to the folder ' + pathPrefixUpload);

                    setTimeout(function() {
                        $('.notification').addClass('d-hide').find('.text').text('');
                        $('.file-upload input[type="file"]').val('');
                    }, 4000);

                });

            //- re-render dirs
            window.uploadActiveFile = $('.blog-item.active li.active div').text();

            $('.blog-list-wrap').html('');

            posts
                .showDirs()
                .then(() => {

                    $('.blog-list-wrap').find('.blog-item span:contains(' + pathPrefixUpload + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + uploadActiveFile + ')').addClass('active').click();

                    setTimeout(function() {
                        $('.blog-item.active ul li:contains(' + uploadActiveFile + ')').addClass('active').click();
                    }, 1000);

                    myCodeMirror.setValue('');

                });

        });

        /*
         * Set publish date
         */
        $(document).on('click', '.publish-date', function(e) {

            e.preventDefault();
            e.stopPropagation();

            if (!($(this).hasClass('disabled'))) {
                $('.icon-wrap i').removeClass('active');
                $('.icon-wrap .i-calendar').addClass('active');
                $('form').addClass('d-hide');
                $('.publish-date-form').removeClass('d-hide');

                window.pathPrefixPdate = $('.blog-item.active').find('span').text();
            }

        });

        $(window).click(function() {
            $('.publish-date-form').addClass('d-hide');
        });

        $(document).on('click', '.publish-date-form, .Zebra_DatePicker', function(event) {
            event.stopPropagation();
        });

        $('.publish-date-form').on('submit', function(e) {

            e.preventDefault();
            let publishDate = $('.publish-date-form input').val();


            if (pathPrefixPdate === '') {

                $('.notification').removeClass('d-hide').addClass('error-msg').find('.text').text('Please select post on the left to set publish date');

                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                    $('.publish-date-form input').val('');
                }, 4000);

            } else {

                if (publishDate !== '') {

                    $(this).find('button').attr("disabled", "disabled");
                    $('.loader').addClass('active');

                    // convert human readable date to epoch
                    let myDate = new Date(publishDate);
                    let myEpoch = myDate.getTime() / 1000.0;

                    posts
                        .setPublishDate(myEpoch, pathPrefixPdate)
                        .then(() => {

                            $(this).find('button').removeAttr("disabled");
                            $('.loader').removeClass('active');
                            $('.publish-date-form').addClass('d-hide');
                            $('.notification').removeClass('d-hide').find('.text').text('Publish date was successfully set for post ' + pathPrefixPdate);

                            setTimeout(function() {
                                $('.notification').addClass('d-hide').find('.text').text('');
                            }, 4000);

                        });

                    // re-render dirs

                    $('.blog-list-wrap').html('');

                    posts
                        .showDirs()
                        .then(() => {

                            $('.blog-list-wrap').find('.blog-item span:contains(' + pathPrefixPdate + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

                            setTimeout(function() {
                                $('.blog-item.active ul li:contains(\'dat.yaml\')').addClass('active').click();
                            }, 1000);

                            myCodeMirror.setValue('');

                        });

                }

            }

        });


        /*
         * Enable pug editing
         */
        $(document).on('click', '.js-enable-pug', function(e) {

            e.preventDefault();

            $(this).toggleClass('js-pug-enabled');
            $('.easter-pug').toggleClass('active');

            // log mbake Base.js version
            posts.MbakeVersion();

        });

    });

}