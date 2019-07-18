var IntuAPI = (function () {
    function IntuAPI() {
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        console.log("TCL: IntuAPI -> constructor -> apiPort", port);
        this.serviceRPC = new httpRPC(pro, host, port);
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        if (email !== null && pass !== null) {
            this.serviceRPC.setUser(email, pass);
        }
    }
    IntuAPI.prototype.checkEditor = function (email, pass) {
        var _this = this;
        return this.serviceRPC.invoke('api', 'editors', 'checkEditor', {
            editor_email: email,
            editor_pass: pass
        })
            .then(function (result) {
            console.log('check editor, result: ', result);
            if (result) {
                _this.serviceRPC.setUser(email, pass);
                return true;
            }
            else {
                return false;
            }
        });
    };
    IntuAPI.prototype.getDirsList = function () {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'get-items', {
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.getSubDirsList = function (id) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'get-files', {
            post_id: id,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.getFile = function (id, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'get-file-content', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.saveFile = function (id, md, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'save-file', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.mbakeCompile = function (id, md, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'compile-code', {
            post_id: id,
            pathPrefix: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        }).then(function (response) {
            return response;
        }).catch(function (error) {
            return error;
        });
    };
    IntuAPI.prototype.clonePage = function (id, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'clone-page', {
            post_id: id,
            pathPrefix: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.upload = function (data, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'upload', {
            pathPrefix: pathPrefix,
            editor_email: email,
            editor_pass: pass
        }, data.get('sampleFile'))
            .then(function (response) {
            console.info(response);
        })
            .catch(function (error) {
            console.info(error);
        });
    };
    IntuAPI.prototype.setPublishDate = function (publish_date, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'set-publish-date', {
            publish_date: publish_date,
            post_id: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.getMbakeVersion = function () {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'editors', 'mbake-version', {
            editor_email: email,
            editor_pass: pass
        })
            .then(function (response) {
            console.info('Base.js mbake version:', response);
        });
    };
    IntuAPI.prototype.sendVcodEditor = function (email) {
        return this.serviceRPC.invoke('api', 'editors', 'reset-password-code', { admin_email: email })
            .then(function () {
            return true;
        });
    };
    IntuAPI.prototype.resetPassEditor = function (email, code, pass) {
        return this.serviceRPC.invoke('api', 'editors', 'reset-password', {
            admin_email: email,
            code: code,
            password: pass
        });
    };
    IntuAPI.prototype.checkAdmin = function (email, pass) {
        var _this = this;
        return this.serviceRPC.invoke('admin', 'admin', 'checkAdmin', {
            admin_email: email,
            admin_pass: pass
        })
            .then(function (result) {
            console.info("--result:", result);
            if (result) {
                _this.serviceRPC.setUser(email, pass);
                return true;
            }
            else {
                return false;
            }
        });
    };
    IntuAPI.prototype.setupApp = function (item) {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'admin', 'setup-app', {
            item: item,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.getEditorsList = function () {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        console.info("--admin_email:", admin_email);
        return this.serviceRPC.invoke('admin', 'admin', 'getEditors', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.addEditor = function (guid, name, email, password) {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('admin', 'admin', 'addEditor', {
            guid: guid,
            name: name,
            email: email,
            password: password,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.editEditor = function (uid, name) {
        return this.serviceRPC.invoke('admin', 'admin', 'edit-editor', {
            name: name,
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    };
    IntuAPI.prototype.deleteEditor = function (uid) {
        return this.serviceRPC.invoke('admin', 'admin', 'deleteEditor', {
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    };
    IntuAPI.prototype.sendVcode = function (email) {
        return this.serviceRPC.invoke('api', 'admin', 'resetPassword-code', { admin_email: email })
            .then(function () {
            return true;
        });
    };
    IntuAPI.prototype.resetPass = function (email, code, pass) {
        return this.serviceRPC.invoke('admin', 'admin', 'reset-password', {
            admin_email: email,
            code: code,
            password: pass
        });
    };
    IntuAPI.prototype.getConfig = function () {
        console.log('get config start');
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('admin', 'admin', 'getConfig', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.updateConfig = function (port, path, printfulApi) {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'admin', 'update-config', {
            admin_email: admin_email,
            admin_pass: admin_pass,
            port: port,
            path: path,
            printfulApi: printfulApi.length ? printfulApi : ''
        });
    };
    IntuAPI.prototype.createConfig = function (serialised) {
        var email = serialised.filter(function (email) { return email.name == 'email'; })[0].value;
        var password = serialised.filter(function (password) { return password.name == 'password'; })[0].value;
        var emailjsService_id = serialised.filter(function (emailjsService_id) { return emailjsService_id.name == 'service_id'; })[0].value;
        var emailjsTemplate_id = serialised.filter(function (emailjsTemplate_id) { return emailjsTemplate_id.name == 'template_id'; })[0].value;
        var emailjsUser_id = serialised.filter(function (emailjsUser_id) { return emailjsUser_id.name == 'user_id'; })[0].value;
        return this.serviceRPC.invoke('setup', 'setup', 'setup', {
            email: email,
            password: password,
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id,
        })
            .then(function (result) {
            console.info('test api: ', result);
            return result;
        }).catch(function (error) {
            console.info("--error:", error);
        });
    };
    return IntuAPI;
}());
