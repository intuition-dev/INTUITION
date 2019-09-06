'use strict';

var myCodeMirror = null;
var editViewModel = null;

depp.define({
    'editViewModel': [
        '/edit/models/EditViewModel.js'
    ]
});

depp.require('baseVm');
depp.require('editViewModel');

depp.require(['ui', 'scripts', 'fileUpload', 'editViewModel'], async function () {
    editViewModel = await EditViewModel.inst();

    initUpload();

    $(document).on('click', '.js-view-page', function(e) {
        if ($(this).hasAttribute('disabled')) {
            e.preventDefault();
        }
    });

    let hash = window.location.hash.substr(1);

    loadTextarea();
    init(hash, editViewModel);
    
    $('.js-view-page').attr('href', appMount);

    // show sub directories
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
            showSubDirs(postId, editViewModel);
        } else {
            $(this).find('ul').remove();
        }

    });

    // Refresh directiories
    $(document).on('click', '.icono-sync', function(e) {
        e.preventDefault();

        if ($('.blog-item').hasClass('active')) {

            let dirActive = $('.blog-item.active').find('span').text();
            let fileActive = $('.blog-item.active li.active div').text();
            $('.loader').addClass('active');
            $('.blog-list-wrap').html('');

            // refresh dirs
            refresh(dirActive, fileActive, editViewModel);

        } else {

            // re-render dirs
            $('.loader').addClass('active');
            $('.blog-list-wrap').html('');
            refreshClosed(editViewModel);

        }
    });

    // show file contents
    $(document).on('click', '.blog-item li', function(e) {
        e.preventDefault();
        e.stopPropagation(); // prevent child trigger click on parent

        let target = $(this);
        let postId = $(this).text();
        refreshTextarea(postId, target, editViewModel);

    });

    // save file
    $(document).on('click', '.save', function(e) {
        e.preventDefault();
        let postId = $('.blog-item.active').find('li.active').text();
        let pathPrefix = $('.blog-item.active').find('span').text();
        let md = myCodeMirror.getValue();
        $(this).attr("disabled", "disabled");
        $('.loader').addClass('active');
        let target = $(this);

        saveMd(postId, md, pathPrefix, target, editViewModel);

    });

    /*********
    * clone page
    ********/

    // form show/hide
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
            let target = $(this);

            // add cloned post
            addPost(postId, pathPrefix, target, editViewModel)

            // refresh dirs
            $('.blog-list-wrap').html('');

            refreshDirsOnClone(postId, editViewModel);
                
        }

    });

    /*********
    * File upload
    **********/
    function initUpload() {
        console.log('initUpload')
        const uppy = Uppy.Core({
            debug: true,
            autoProceed: false,
            restrictions: {
              maxFileSize: 1000000,
              maxNumberOfFiles: 3,
              minNumberOfFiles: 1,
              allowedFileTypes: ['image/*', 'video/*']
            }
        })
        .use(Uppy.Dashboard, {
            trigger: '.uppy-modal-opener-btn',
            metaFields: [
                { id: 'name', name: 'Name', placeholder: 'file name' },
                { id: 'caption', name: 'Caption', placeholder: 'describe what the image is about' }
              ],
              browserBackButtonClose: true
        })
        .use(Uppy.XHRUpload, { 
            endpoint: '/upload' ,
            formData: true,
            fieldName: 'sampleFile'
        })

        uppy.on('file-added', (file) => {
            uppy.setMeta({
              'targetDir': '/' + $('.blog-item.active').find('span').text()
            })
          })
      
        uppy.on('complete', (result) => {
            console.log('Upload complete! Files uploaded:', result.successful)
        })
   }

    /************ 
    * Set publish date
    ***********/

    // toggle form
    $(document).on('click', '.publish-date', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!($(this).hasClass('disabled'))) {
            $('.icon-wrap i').removeClass('active');
            $('.icon-wrap .i-calendar').addClass('active');
            $('form').addClass('d-hide');
            $('.publish-date-form').removeClass('d-hide');
            window.pathPrefixPdate = $('.blog-item.active').find('span').text();
            if (window.pathPrefixPdate === 0 && $('.blog-item.active').length !== 0 && $('.blog-item.active li.active').text === 'dat.yaml') {
                window.pathPrefixPdate = "\/";
            }
        }

    });
    $(window).click(function() {
        $('.publish-date-form').addClass('d-hide');
    });
    $(document).on('click', '.publish-date-form, .Zebra_DatePicker', function(event) {
        event.stopPropagation();
    });

    // set date
    $('.publish-date-form').on('submit', function(e) {
        e.preventDefault();
        let publishDate = $('.publish-date-form input').val();
        if (pathPrefixPdate === '' && !($('.blog-item').hasClass('active'))) {
            
            $('.notification').removeClass('d-hide').addClass('error-msg').find('.text').text('Please select post on the left to set publish date');
            
            setTimeout(function() {
                $('.notification').addClass('d-hide').find('.text').text('');
                $('.publish-date-form input').val('');
            }, 4000);
            
        } else {

            if (pathPrefixPdate === '' && ($('.blog-item').hasClass('active'))) {
                pathPrefixPdate = '/';
            } 

            if (publishDate !== '') {

                $(this).find('button').attr("disabled", "disabled");
                $('.loader').addClass('active');

                // convert human readable date to epoch
                let myDate = new Date(publishDate);
                let myEpoch = myDate.getTime() / 1000.0;

                setPublishDate(myEpoch, pathPrefixPdate, editViewModel);

                // refresh dirs
                $('.blog-list-wrap').html('');

                refreshOnSetDate(pathPrefixPdate, editViewModel);

            }

        }

    });

    $('.sign-out').on('click', function (e) {
        e.preventDefault();
        signOut();
    });

});


function loadTextarea() {

    depp.define({
        'codeEdit': [
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.css',
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/theme/solarized.css',

            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/lib/codemirror.min.js',
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/markdown/markdown.js',
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/yaml/yaml.js',
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/pug/pug.js', 
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/mode/css/css.js',
            '//cdn.jsdelivr.net/npm/codemirror@5.46.0/keymap/sublime.js'
        ]
    });
    
    depp.require('codeEdit', pgInit);
}
    
function pgInit() {
    _initCodeMirror();
};

function _initCodeMirror(mode) {
    
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


function showDirs(hash, editViewModel) {
    // render folders list
    let listTemp = '';
    return editViewModel.getDirsList()
        .then(posts => {
            if (Array.isArray(posts)) {
                posts.forEach(el => {
                    listTemp += '<div class="blog-item"><i class="knot"><div></div></i><div class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1" width="20px" height="20px"><g id="surface1"><path style=" " d="M 3 2 C 1.34375 2 0 3.34375 0 5 L 0 22 C 0 23.65625 1.34375 25 3 25 L 23 25 C 24.65625 25 26 23.65625 26 22 L 26 8 C 26 6.34375 24.65625 5 23 5 L 11 5 C 11 3.34375 9.65625 2 8 2 Z M 3 7 L 23 7 C 23.550781 7 24 7.449219 24 8 L 24 22 C 24 22.550781 23.550781 23 23 23 L 3 23 C 2.449219 23 2 22.550781 2 22 L 2 8 C 2 7.449219 2.449219 7 3 7 Z "/></g></svg><span>' + el + '</span></div></div>';
                });
                $('.blog-list-wrap').append(listTemp);

            } else {
                console.info('failed to get list of directories');
                window.location = '/edit'
            }
        })
}

function init(hash, editViewModel) {
    showDirs(hash, editViewModel)
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
                    showSubDirs(postId, editViewModel);
                } else {
                    $(this).find('ul').remove();
                }

            }

        });
}

function showSubDirs(id, editViewModel) {
    // render sub folders list
    let listTemp = '';
    return editViewModel.getSubDirsList(id)
        .then(dirs => {
            if (Array.isArray(dirs)) {
                dirs.forEach(el => {
                    listTemp += '<li><div><i class="i-file"></i>' + el + '</div></li>';
                });
                $('.blog-item.active').append('<ul>' + listTemp + '</ul>');
            } else {
                console.info('failed to get subdirectories');
                window.location = '/edit'
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

function showMd(id, pathPrefix) {
    // render .md file content in textarea
    editViewModel.getFile(id, pathPrefix)
        .then(post => {
            if (post) {
                window.myCodeMirror.setValue(post);
            } else {
                console.info('failed to get file content');
                window.location = '/edit'
            }
        });
}

function saveMd(id, md, pathPrefix, target, editViewModel) {
    return editViewModel.saveFile(id, md, pathPrefix)
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
            compile(id, md, pathPrefix)
                .then((response) => {
                    if (response == 'OK') {

                        let msg = 'Files have been built';

                        $('[data-js="errors"]').removeClass('toast-error d-hide').html(msg);

                        setTimeout(function() {
                            $('[data-js="errors"]').addClass('d-hide toast-error').html('');
                        }, 3000);

                    } else {

                        var msg = response.msg + ' in ' + response.filename + ' at line ' + response.line + '<br />'
                        $('[data-js="errors"]').html(msg);
                        $('[data-js="errors"]').removeClass('d-hide');

                    }
                    console.info('build');
                });
        });
}

function compile(id, md, pathPrefix) {
    return editViewModel.mbakeCompile(id, md, pathPrefix)
        .then(resp => {
            return resp;
        })
}

function addPost(id, pathPrefix, target) {
    return editViewModel.clonePage(id, pathPrefix)
        .then(() => {

            target.removeAttr("disabled");
            $('.loader').removeClass('active');

            $('.notification').removeClass('d-hide').find('.text').text('New post was added, now you can edit the content');

            setTimeout(function() {
                $('.notification').addClass('d-hide').find('.text').text('');
            }, 3000);

            $('.post-name-wrap').addClass('d-hide').find('input').val('');
            $('.create-post').removeClass('active');

        });
}

function uploadFile(input, pathPrefix, target, pathPrefixUpload) {
    var data = new FormData();
    data.append('sampleFile', input);

    return editViewModel.upload(data, pathPrefix)
        .then(() => {

            target.removeAttr("disabled");
            $('.loader').removeClass('active');
            $('.file-upload').addClass('d-hide');
            $('.notification').removeClass('d-hide').find('.text').text('The file was successfully uploaded to the folder ' + pathPrefixUpload);

            setTimeout(function() {
                $('.notification').addClass('d-hide').find('.text').text('');
                $('.file-upload input[type="file"]').val('');
            }, 3000);

        });
}

function setPublishDate(date, itemPath) {
    return editViewModel.setPublishDate(date, itemPath)
        .then(() => {

            $(this).find('button').removeAttr("disabled");
            $('.loader').removeClass('active');
            $('.publish-date-form').addClass('d-hide');
            $('.notification').removeClass('d-hide').find('.text').text('Publish date was successfully set for post ' + itemPath);

            setTimeout(function() {
                $('.notification').addClass('d-hide').find('.text').text('');
            }, 3000);

        });
}

function refresh(dirActive, fileActive, editViewModel) {
    showDirs('', editViewModel)
        .then(() => {
            $('.blog-list-wrap').find('.blog-item span:contains(' + dirActive + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + fileActive + ')').addClass('active').click();

            setTimeout(function() {
                $('.blog-item.active ul li:contains(' + fileActive + ')').addClass('active').click();
                $('.loader').removeClass('active');
            }, 1000);

        });
}

function refreshClosed(editViewModel) {
    showDirs('', editViewModel).then(() => $('.loader').removeClass('active'));
}

function refreshTextarea(postId, target, editViewModel) {
    
    let mdFile = '.md';
    let datFile = '.yaml';
    let csvFile = '.csv';
    let cssFile = '.css';
    let pugFile = '.pug';

    switch (true) {
        case postId.includes(mdFile):
            _initCodeMirror('markdown');
            break;
        case postId.includes(datFile):
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
        case postId.includes(pugFile):
            _initCodeMirror('pug');
            break;
        default:
            _initCodeMirror('text');
    }

    $('.blog-item li').removeClass('active');
    target.addClass('active');

    let pathPrefix = target.parents('.blog-item').find('span').text();
    let editedFileName = postId.replace('/', '');

    $('.js-file-name').text(editedFileName);

    showMd(postId, pathPrefix, editViewModel);

    $('.btn-custom.save').removeAttr("disabled");
    $('.i-calendar').addClass('disabled');

    if (postId.includes(datFile)) {
        $('.i-calendar').removeClass('disabled');
    }
}

function refreshDirsOnClone(postId, editViewModel) {
    showDirs('', editViewModel)
        .then(() => {

            $('.blog-list-wrap').find('.blog-item span:contains(' + postId + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

            setTimeout(function() {
                $('.blog-item.active ul li:contains(\'.md\')').addClass('active').click();
            }, 1000);

        });
        
}

function refreshOnUpload(itemPath, activeFile, editViewModel) {
    showDirs('', editViewModel)
        .then(() => {

            $('.blog-list-wrap').find('.blog-item span:contains(' + itemPath + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(' + activeFile + ')').addClass('active').click();

            setTimeout(function() {
                $('.blog-item.active ul li:contains(' + activeFile + ')').addClass('active').click();
            }, 1000);

            window.myCodeMirror.setValue('');

        });

}

function refreshOnSetDate(itemPath) {
    showDirs('', editViewModel)
        .then(() => {

            $('.blog-list-wrap').find('.blog-item span:contains(' + itemPath + ')').parents('.blog-item').addClass('active').click().find('ul li:contains(\'.md\')').addClass('active').click();

            setTimeout(function() {
                $('.blog-item.active ul li:contains(\'dat.yaml\')').addClass('active').click();
            }, 1000);

            window.myCodeMirror.setValue('');

        });
}

function signOut() {
    sessionStorage.clear();
    console.log("Signing out. Redirecting to /edit")
    window.location = ('/edit');
}