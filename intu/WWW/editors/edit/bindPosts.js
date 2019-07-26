'use strict';



class Posts {
    constructor() {
        this.showDirs = this.showDirs.bind(this);
        this.showMd = this.showMd.bind(this);
        this.intuAPI = new IntuAPI();
    }

    loadTextarea() {

        depp.define({
            'codeEdit': [
                '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.css', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/theme/solarized.css'
    
                , '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.min.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/markdown/markdown.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/yaml/yaml.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/pug/pug.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/css/css.js', '//cdn.jsdelivr.net/npm/codemirror@5.46.0/keymap/sublime.js'
    
            ]
        });
        
        depp.require('codeEdit', this.pgInit.bind(this));
    }
        
    pgInit() {
        this._initCodeMirror();
    };

    _initCodeMirror(mode) {
        
        if (window.myCodeMirror !== null) {

            window.myCodeMirror.toTextArea();

        }
        window.myCodeMirror = CodeMirror.fromTextArea(
            document.querySelector('#cms1'), {
                mode: mode || 'markdown',
                lineNumbers: true,
                tabSize: 3,
                indentWithTabs: false,
                v11iewportMargin: 'Infinity',
                lineWrapping: true
            }
        )
        window.myCodeMirror.setSize('100%', '100%');

    } // initCM();


    showDirs(hash) {
        // render folders list
        let listTemp = '';
        return this.intuAPI.getDirsList()
            .then(posts => {
                if (Array.isArray(posts)) {
                    posts.forEach(el => {
                        listTemp += '<div class="blog-item"><i class="knot"><div></div></i><div class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1" width="20px" height="20px"><g id="surface1"><path style=" " d="M 3 2 C 1.34375 2 0 3.34375 0 5 L 0 22 C 0 23.65625 1.34375 25 3 25 L 23 25 C 24.65625 25 26 23.65625 26 22 L 26 8 C 26 6.34375 24.65625 5 23 5 L 11 5 C 11 3.34375 9.65625 2 8 2 Z M 3 7 L 23 7 C 23.550781 7 24 7.449219 24 8 L 24 22 C 24 22.550781 23.550781 23 23 23 L 3 23 C 2.449219 23 2 22.550781 2 22 L 2 8 C 2 7.449219 2.449219 7 3 7 Z "/></g></svg><span>' + el + '</span></div></div>';
                    });
                    $('.blog-list-wrap').append(listTemp);

                } else {
                    console.info('failed to get list of directories');
                    window.location = '/editors'
                }
            })
    }

    init(hash) {
        this.showDirs(hash)
            .then(() => {

                if (typeof hash !== 'undefined' && hash !== '') {

                    let currentPage = $('.blog-item:contains("' + hash + '")');

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
                        this.showSubDirs(postId);
                    } else {
                        $(this).find('ul').remove();
                    }

                }

            });
    }

    showSubDirs(id) {
        // render sub folders list
        let listTemp = '';
        return this.intuAPI.getSubDirsList(id)
            .then(dirs => {
                if (Array.isArray(dirs)) {
                    dirs.forEach(el => {
                        listTemp += '<li><div><i class="i-file"></i>' + el + '</div></li>';
                    });
                    $('.blog-item.active').append('<ul>' + listTemp + '</ul>');
                } else {
                    console.info('failed to get subdirectories');
                    window.location = '/editors'
                }
            })
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
    }

    showMd(id, pathPrefix) {
        // render .md file content in textarea
        this.intuAPI.getFile(id, pathPrefix)
            .then(post => {
                if (post) {
                    window.myCodeMirror.setValue(post);
                } else {
                    console.info('failed to get file content');
                    window.location = '/editors'
                }
            });
    }

    saveMd(id, md, pathPrefix, target) {
        return this.intuAPI.saveFile(id, md, pathPrefix)
            .then(resp => {
                return resp
            })
            .then(() => {

                target.removeAttr("disabled");
                $('.loader').removeClass('active');
                $('.notification').removeClass('d-hide').find('.text').text('The content was successfully updated');

                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 2000);
                console.info('saved');

            })
            .then(() => {
                this.compile(id, md, pathPrefix)
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
    }

    compile(id, md, pathPrefix) {
        return this.intuAPI.mbakeCompile(id, md, pathPrefix)
            .then(resp => {
                return resp;
            })
    }

    addPost(id, pathPrefix, target) {
        return this.intuAPI.clonePage(id, pathPrefix)
            .then(() => {

                target.removeAttr("disabled");
                $('.loader').removeClass('active');

                $('.notification').removeClass('d-hide').find('.text').text('New post was added, now you can edit the content');

                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 4000);

                $('.post-name-wrap').addClass('d-hide').find('input').val('');
                $('.create-post').removeClass('active');

            });
    }

    uploadFile(input, pathPrefix, target, pathPrefixUpload) {
        var data = new FormData();
        data.append('sampleFile', input);

        return this.intuAPI.upload(data, pathPrefix)
            .then(() => {

                target.removeAttr("disabled");
                $('.loader').removeClass('active');
                $('.file-upload').addClass('d-hide');
                $('.notification').removeClass('d-hide').find('.text').text('The file was successfully uploaded to the folder ' + pathPrefixUpload);

                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                    $('.file-upload input[type="file"]').val('');
                }, 4000);

            });
    }

    setPublishDate(date, itemPath) {
        return this.intuAPI.setPublishDate(date, itemPath)
            .then(() => {

                $(this).find('button').removeAttr("disabled");
                $('.loader').removeClass('active');
                $('.publish-date-form').addClass('d-hide');
                $('.notification').removeClass('d-hide').find('.text').text('Publish date was successfully set for post ' + itemPath);

                setTimeout(function() {
                    $('.notification').addClass('d-hide').find('.text').text('');
                }, 4000);

            });
    }

    refresh(dirActive, fileActive) {
        this.showDirs()
            .then(() => {
                $('.blog-list-wrap').find('.blog-item span:contains(' + dirActive + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + fileActive + ')').addClass('active').click();

                setTimeout(function() {
                    $('.blog-item.active ul li:contains(' + fileActive + ')').addClass('active').click();
                    $('.loader').removeClass('active');
                }, 1000);

            });
    }

    refreshClosed() {
        this.showDirs().then(() => $('.loader').removeClass('active'));
    }

    refreshTextarea(postId, target) {
        
        let mdFile = '.md';
        let datFile = 'dat.yaml';
        let gloFile = 'GLO.yaml';
        let csvFile = '.csv';
        let cssFile = '.css';

        if (postId.includes(mdFile) || postId.includes(datFile) || postId.includes(gloFile) || postId.includes(csvFile) || postId.includes(cssFile)) {
            switch (true) {
                case postId.includes(mdFile):
                    this._initCodeMirror('markdown');
                    break;
                case postId.includes(datFile):
                    this._initCodeMirror('yaml');
                    break;
                case postId.includes(gloFile):
                    this._initCodeMirror('yaml');
                    break;
                case postId.includes(csvFile):
                    this._initCodeMirror('csv');
                    break;
                case postId.includes(cssFile):
                    this._initCodeMirror('css');
                    break;
                case postId.includes(cssFile):
                    this._initCodeMirror('css');
                    break;
                default:
                   this._initCodeMirror('text');
            }

            $('.blog-item li').removeClass('active');
            target.addClass('active');

            let pathPrefix = target.parents('.blog-item').find('span').text();
            let editedFileName = postId.replace('/', '');

            $('.js-file-name').text(editedFileName);

            this.showMd(postId, pathPrefix);

            $('.btn-custom.save').removeAttr("disabled");
            $('.i-calendar').addClass('disabled');

            if (postId.includes(datFile)) {
                $('.i-calendar').removeClass('disabled');
            }
        }
    }

    enablePug() {
        this._initCodeMirror('pug');
    }

    refreshDirsOnClone(postId) {
        this.showDirs()
            .then(() => {

                $('.blog-list-wrap').find('.blog-item span:contains(' + postId + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

                setTimeout(function() {
                    $('.blog-item.active ul li:contains(\'.md\')').addClass('active').click();
                }, 1000);

            });
            
    }

    refreshOnUpload(itemPath, activeFile) {
        this.showDirs()
            .then(() => {

                $('.blog-list-wrap').find('.blog-item span:contains(' + itemPath + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + activeFile + ')').addClass('active').click();

                setTimeout(function() {
                    $('.blog-item.active ul li:contains(' + activeFile + ')').addClass('active').click();
                }, 1000);

                window.myCodeMirror.setValue('');

            });

    }

    refreshOnSetDate(itemPath) {
        this.showDirs()
            .then(() => {

                $('.blog-list-wrap').find('.blog-item span:contains(' + itemPath + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

                setTimeout(function() {
                    $('.blog-item.active ul li:contains(\'dat.yaml\')').addClass('active').click();
                }, 1000);

                window.myCodeMirror.setValue('');

            });
    }

}