class IntuAPI {
    constructor() {
        var pro = window.location.protocol;
        pro = pro.replace(':', '');
        var host = window.location.hostname;
        var port = window.location.port;
        this.serviceRPC = new httpRPC(pro, host, port);
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        if (email !== null && pass !== null) {
            this.serviceRPC.setUser(email, pass);
        }
    }
    checkEditor(email, pass) {
        let _this = this;
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
    }
    getDirsList() {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'getDirs', {
            editor_email: email,
            editor_pass: pass
        });
    }
    getSubDirsList(id) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'getFiles', {
            itemPath: id,
            editor_email: email,
            editor_pass: pass
        });
    }
    getFile(id, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'getFileContent', {
            itemPath: id,
            file: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }
    saveFile(id, md, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'saveFile', {
            itemPath: id,
            file: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        });
    }
    mbakeCompile(id, md, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'compileCode', {
            itemPath: id,
            file: pathPrefix,
            content: btoa(md),
            editor_email: email,
            editor_pass: pass
        }).then(response => {
            return response;
        }).catch(error => {
            return error;
        });
    }
    clonePage(id, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'cloneItem', {
            newItemPath: id,
            itemPath: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }
    setPublishDate(publish_date, pathPrefix) {
        let email = window.sessionStorage.getItem('username');
        let pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('api', 'setPublishDate', {
            publish_date: publish_date,
            itemPath: pathPrefix,
            editor_email: email,
            editor_pass: pass
        });
    }
    sendVcodEditor(email) {
        return this.serviceRPC.invoke('api', 'emailResetPasswordCode', { admin_email: email })
            .then(function () {
            return true;
        });
    }
    resetPassEditor(email, code, pass) {
        return this.serviceRPC.invoke('api', 'resetPasswordIfMatch', {
            admin_email: email,
            code: code,
            password: pass
        });
    }
    checkAdmin(email, pass) {
        let _this = this;
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
    }
    setupApp(item) {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'setup-app', {
            item: item,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    }
    getEditorsList() {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'getEditors', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    }
    addEditor(guid, name, email, password) {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'addEditor', {
            id: guid,
            name: name,
            email: email,
            password: password,
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    }
    editEditor(uid, name) {
        return this.serviceRPC.invoke('adminAPI', 'editEditor', {
            name: name,
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    }
    deleteEditor(uid) {
        return this.serviceRPC.invoke('adminAPI', 'deleteEditor', {
            uid: uid,
            admin_email: window.sessionStorage.getItem('username'),
            admin_pass: window.sessionStorage.getItem('password')
        });
    }
    getConfig() {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'getConfig', {
            admin_email: admin_email,
            admin_pass: admin_pass
        });
    }
    updateConfig(emailjsService_id, emailjsTemplate_id, emailjsUser_id) {
        let admin_email = window.sessionStorage.getItem('username');
        let admin_pass = window.sessionStorage.getItem('password');
        return this.serviceRPC.invoke('adminAPI', 'updateConfig', {
            admin_email: admin_email,
            admin_pass: admin_pass,
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id
        });
    }
}
