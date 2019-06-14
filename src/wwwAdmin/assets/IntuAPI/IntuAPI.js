/**
 * 
 * All rights reserved by MetaBake (MetaBake.org), licensed under LGPL 3.0
 *
 */

/**
 * CRUD users for admin app and files operations for editor app
 */
class WebAdmin {

    /**
     * @param apiProtocol api protocol (eg: http)
     * @param apiHost api host (eg: 0.0.0.0)
     * @param apiPort api port (eg: 9081)
     */
    constructor() {
        this.serviceRPC = new httpRPC(apiProtocol, apiHost, apiPort);
    }

    // Editor App requests

    /** editor users authentication
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    checkEditor(email, pass) {
        console.info("--email:", email)
        console.info("--pass:", pass)
        let _this = this
        return this.serviceRPC.invoke('/api/editors/checkEditor', 'check-editor', {
                editor_email: email,
                editor_pass: pass
            })
            .then(function(result) {
                if (result) {
                    _this.serviceRPC.setUser(email, pass);
                    return true
                } else {
                    return false
                }
            })
    }

    /**
     * get list of directories
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    getDirsList() {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/posts', 'get', {
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * get directories' subdirectories list
     * @param id path to post, eg: 'blog/post-2'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    getSubDirsList(id) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/files', 'get', {
            post_id: id,
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * get file content
     * @param id file name, eg: '/title.md'
     * @param pathPrefix path to file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    getFile(id, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/post-get', 'get', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * save file
     * @param id file name, eg: '/title.md'
     * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
     * @param pathPrefix path to file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    saveFile(id, md, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/post-put', 'put', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * run mbake to compile files
     * @param id file name, eg: '/title.md'
     * @param md file content, eg: '###### Lorem ipsum dd dolor sit {.title}'
     * @param pathPrefix path to file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    mbakeCompile(id, md, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/post-build', 'put', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        }).then(function(response) {
            return response;
        }).catch(function(error) {
            return error;
        });
    }

    /**
     * clone page
     * @param id new page folder name, eg: 'post-cpv'
     * @param pathPrefix path to file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    clonePage(id, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/new-post', 'post', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * file upload
     * @param data FormData
     * @param pathPrefix path to file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    upload(data, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/upload', 'post', {
                pathPrefix: pathPrefix,
                editor_email: email,
                editor_pass: pass
            }, data.get('sampleFile'))
            .then(function(response) {
                console.info(response);
            })
            .catch(function(error) {
                console.info(error);
            });
    }

    /**
     * set publishDate field to dat.yaml
     * @param publish_date epoch date format, eg: '1602288000'
     * @param pathPrefix post path file, eg: 'blog/post-4'
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    setPublishDate(publish_date, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/editors/set-publish-date', 'put', {
            publish_date: publish_date,
            post_id: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }

    /**
     * get mbake version
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    getMbakeVersion() {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC
            .invoke('/api/editors/mbake-version', 'get', {
                editor_email: email,
                editor_pass: pass
            })
            .then(function(response) {
                console.info('Base.js mbake version:', response);
            });
    }


    // Admin App requests

    /**
     * admin authentication
     * @param email user email, eg: 'example@example.com'
     * @param pass user password, eg: '123456'
     */
    checkAdmin(email, pass) {
        let _this = this
        return this.serviceRPC.invoke('/api/admin/checkAdmin', 'check-admin', {
                admin_email: email,
                admin_pass: pass
            })
            .then(function(result) {
                console.info("--result:", result)
                if (result) {
                    _this.serviceRPC.setUser(email, pass);
                    return true
                } else {
                    return false
                }
            })
    }

    /**
     * TODO: @param item item, eg: ''
     * @param admin_email admin user email, eg: 'example@example.com'
     * @param admin_pass admin user password, eg: '123456'
     */
    setupApp(item) {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('/api/admin/setup-app', 'setup-app', {
            item: item,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    }
    getConfigs() {
        return this.serviceRPC.invoke('/api/admin/get-configs', 'get-configs', { admin_email: window.sessionStorage.getItem('username'), admin_pass: window.sessionStorage.getItem('password') });
    }


    /**
     * get data for editors table
     */
    getEditorsList() {
        console.info("--window.sessionStorage.getItem('username'):", window.sessionStorage.getItem('username'))
        return this.serviceRPC.invoke('/api/admin/editors', 'get', { admin_email: window.sessionStorage.getItem('username'), admin_pass: window.sessionStorage.getItem('password') });
    }

    /**
     * add new user
     * @param name user name, eg: 'Jane Doe'
     * @param email user email, eg: 'example@example.com'
     * @param password user password, eg: 'dfgsdgdsfg' 
     */
    addEditor(name, email, password) {
        return this.serviceRPC.invoke('/api/admin/editors-add', 'post', {
            name: name,
            email: email,
            password: password,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    }

    /**
     * edit user name
     * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
     * @param name user name, eg: 'Jane Doe'
     */
    editEditor(uid, name) {
        return this.serviceRPC.invoke('/api/admin/editors-edit', 'put', {
            name: name,
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    }

    /**
     * remove user 
     * @param uid user id, eg: 'I3fE7p5NjtV1Y1m5pWBsZlyi4W62'
     */
    deleteEditor(uid) {
        return this.serviceRPC.invoke('/api/admin/editors-delete', 'delete', {
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    }

    /**
     * TODO 
     * 
     */
    sendVcode(email) {
        return this.serviceRPC.invoke('/api/admin/resetPassword', 'code', { admin_email: email })
            .then(function() {
                return true;
            })
    }

    /**
     * TODO 
     * 
     */
    resetPass(email, code, pass) {
        return this.serviceRPC.invoke('/api/admin/resetPassword', 'reset-password', {
            admin_email: email,
            code: code,
            password: pass
        })
    }

}