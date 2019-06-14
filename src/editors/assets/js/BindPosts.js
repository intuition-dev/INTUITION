'use strict';



class Posts {
    constructor() {
        this.showDirs = this.showDirs.bind(this);
        this.showMd = this.showMd.bind(this);
        this.webAdmin = new WebAdmin();
    }
    showDirs() {
        // render folders list
        let listTemp = '';
        return this.webAdmin.getDirsList()
            .then(posts => {
                if (Array.isArray(posts)) {
                    posts.forEach(el => {
                        listTemp += '<div class="blog-item"><i class="knot"><div></div></i><div class="d-flex"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1" width="20px" height="20px"><g id="surface1"><path style=" " d="M 3 2 C 1.34375 2 0 3.34375 0 5 L 0 22 C 0 23.65625 1.34375 25 3 25 L 23 25 C 24.65625 25 26 23.65625 26 22 L 26 8 C 26 6.34375 24.65625 5 23 5 L 11 5 C 11 3.34375 9.65625 2 8 2 Z M 3 7 L 23 7 C 23.550781 7 24 7.449219 24 8 L 24 22 C 24 22.550781 23.550781 23 23 23 L 3 23 C 2.449219 23 2 22.550781 2 22 L 2 8 C 2 7.449219 2.449219 7 3 7 Z "/></g></svg><span>' + el + '</span></div></div>';
                    });
                    $('.blog-list-wrap').append(listTemp);

                } else {
                    window.location = '/editors'
                }
            });
    }

    showSubDirs(id) {
        // render sub folders list
        let listTemp = '';
        return this.webAdmin.getSubDirsList(id)
            .then(dirs => {
                if (Array.isArray(dirs)) {
                    dirs.forEach(el => {
                        listTemp += '<li><div><i class="i-file"></i>' + el + '</div></li>';
                    });
                    $('.blog-item.active').append('<ul>' + listTemp + '</ul>');
                } else {
                    window.location = '/editors'
                }
            });
    }

    showMd(id, pathPrefix) {
        // render .md file content in textarea
        this.webAdmin.getFile(id, pathPrefix)
            .then(post => {
                if (post) {
                    myCodeMirror.setValue(post);
                } else {
                    window.location = '/editors'
                }
            });
    }

    saveMd(id, md, pathPrefix) {
        return this.webAdmin.saveFile(id, md, pathPrefix)
            .then(function(resp) {
                return resp.data
            })
    }

    compile(id, md, pathPrefix) {
        return this.webAdmin.mbakeCompile(id, md, pathPrefix)
            .then(function(resp) {
                return resp.data
            })
    }

    addPost(id, pathPrefix) {
        return this.webAdmin.clonePage(id, pathPrefix);
    }

    uploadFile(input, pathPrefix) {
        var data = new FormData();
        data.append('sampleFile', input);

        return this.webAdmin.upload(data, pathPrefix);
    }

    setPublishDate(publishDate, pathPrefix) {
        return this.webAdmin.setPublishDate(publishDate, pathPrefix);
    }

    MbakeVersion() {
        return this.webAdmin.getMbakeVersion();
    }

}