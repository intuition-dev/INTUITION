/**
     * 
     * All rights reserved by MetaBake (MetaBake.org), licensed under LGPL 3.0
     *
*/

/**
* CRUD .md files and post creation from blog mounted app
*/
class WebAdmin {

    /**
    * @param baseURL_ base api url (example: http://0.0.0.0:3030/)
    */
    constructor(baseURL_) {
        let token = sessionStorage.getItem('idToken');
        if (token === null) {
            auth
                .signOut()
                .then(function () {
                    if (window.location.pathname !== '/' && window.location.pathname !== '') {
                        window.location = ('/');
                    }
                }).catch(function (error) {
                    console.info('Something went wrong:', error);
                });
        }
        this.service = axios.create({
            baseURL: baseURL_,
            headers: {
                'fb-auth-token': token
            },
            responseType: 'json'
        });

        this.service.interceptors.response.use(function (response) {
            // Do something with response data
            console.info('response', response);
            console.info('mbake version: ', response.headers['mbake-ver']);
            return response;
        }, function (error) {
            // With response error redirect
            if (401 === error.response.status) {
                // wrong token -- access denied
                auth
                    .signOut()
                    .then(function () {
                        window.location = ('/');
                    }).catch(function (error) {
                        console.info('Something went wrong:', error);
                    });
            }
            return Promise.reject(error);
        });
    }

    /**
    * get list of directories
    */
    getDirsList() {
        return this.service.get('/editors/posts');
    }

    /**
    * get directories' subdirectories list
    * @param id path to post, eg: 'blog/post-2'
    */
    getSubDirsList(id) {
        return this.service.get('/editors/files', {
            params: {
                post_id: id
            }
        });
    }

    /**
    * get files
    * @param id file name, eg: '/title.md'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
    getPostMd(id, pathPrefix) {
        return this.service.get('/editors/post', {
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

    /**
    * save file and run mbake
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
    savePostMd(id, md, pathPrefix) {
        return this.service.put('/editors/post', md, {
            headers: { 'Content-Type': 'text/plain' },
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

    /**
    * run mbake
    * @param id file name, eg: '/title.md'
    * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
    build(id, md, pathPrefix) {
        return this.service.put('/editors/post-build', md, {
            headers: { 'Content-Type': 'text/plain' },
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    }

    /**
    * clone page
    * @param id new page folder name, eg: 'post-cpv'
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
    createPost(id, pathPrefix) {
        console.info('post_id', id);
        return this.service.post('/editors/new-post', {}, {
            params: {
                post_id: id,
                pathPrefix: pathPrefix
            }
        });
    }

    /**
    * file upload
    * @param data FormData
    * @param pathPrefix path to file, eg: 'blog/post-4'
    */
    upload(data, pathPrefix) {
        return this.service.post('/editors/upload', data, {
            params: {
                pathPrefix: pathPrefix
            }
        })
            .then(function (response) {
                console.info(response);
            })
            .catch(function (error) {
                console.info(error);
            });
    }

    /**
    * set publishDate field to dat.yaml
    * @param publish_date epoch date format, eg: '1602288000'
    * @param pathPrefix post path file, eg: 'blog/post-4'
    */
    setPublishDate(publish_date, pathPrefix) {
        return this.service.put('/editors/set-publish-date', {
            publish_date: publish_date,
            post_id: pathPrefix
        });
    }

    /**
    * get list of directories
    */
    getMbakeVersion() {
        return this.service
            .get('/editors/mbake-version')
            .then(function (response) {
                console.info('Base.js mbake version:', response.headers['mbake-ver']);
            });
    }

}