var IntuAPI = (function () {
    function IntuAPI() {
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        this.serviceRPC = new httpRPC(pro, host, port);
        this.serviceRPC.DEBUG = true;
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        if (email !== null && pass !== null) {
            this.serviceRPC.setUser(email, pass);
        }
    }
    IntuAPI.prototype.checkEditor = function (email, pass) {
        var _this = this;
        return this.serviceRPC.invoke('api', 'checkEditor', {
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
        return this.serviceRPC.invoke('api', 'getDirs', {
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.getSubDirsList = function (id) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'getFiles', {
            itemPath: id,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.getFile = function (id, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'getFileContent', {
            itemPath: id,
            file: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.saveFile = function (id, md, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'saveFile', {
            itemPath: id,
            file: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.mbakeCompile = function (id, md, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'compileCode', {
            itemPath: id,
            file: pathPrefix,
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
        return this.serviceRPC.invoke('api', 'cloneItem', {
            newItemPath: id,
            itemPath: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.setPublishDate = function (publish_date, pathPrefix) {
        var email = window.sessionStorage.getItem('username');
        var pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'setPublishDate', {
            publish_date: publish_date,
            itemPath: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    };
    IntuAPI.prototype.sendVcodEditor = function (email) {
        return this.serviceRPC.invoke('api', 'emailResetPasswordCode', { admin_email: email })
            .then(function () {
            return true;
        });
    };
    IntuAPI.prototype.resetPassEditor = function (email, code, pass) {
        return this.serviceRPC.invoke('api', 'resetPasswordIfMatch', {
            admin_email: email,
            code: code,
            password: pass
        });
    };
    IntuAPI.prototype.checkAdmin = function (email, pass) {
        var _this = this;
        return this.serviceRPC.invoke('adminAPI', 'checkAdmin', {
            admin_email: email,
            admin_pass: pass
        })
            .then(function (result) {
            console.log("TCL: IntuAPI -> checkAdmin -> result", result);
            if (result == 'OK') {
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
        return this.serviceRPC.invoke('adminAPI', 'setup-app', {
            item: item,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.getEditorsList = function () {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'getEditors', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.addEditor = function (guid, name, email, password) {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'addEditor', {
            id: guid,
            name: name,
            email: email,
            password: password,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.editEditor = function (uid, name) {
        return this.serviceRPC.invoke('adminAPI', 'editEditor', {
            name: name,
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    };
    IntuAPI.prototype.deleteEditor = function (uid) {
        return this.serviceRPC.invoke('adminAPI', 'deleteEditor', {
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    };
    IntuAPI.prototype.getConfig = function () {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'getConfig', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    };
    IntuAPI.prototype.updateConfig = function (emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        var admin_email = window.sessionStorage.getItem('username');
        var admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'updateConfig', {
            admin_email: admin_email,
            admin_pass: admin_pass,
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id
        });
    };
    return IntuAPI;
}());
