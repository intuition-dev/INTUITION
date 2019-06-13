/**
 * Version v4.2
 * 
 * All rights reserved by MetaBake (MetaBake.org), licensed under LGPL 3.0
 *
 */

/**
 * CRUD users for Editors App
 */
class AdminWebAdmin {
    constructor() {

        this.serviceRpc = new httpRPC(rpcProtocol, rpcHost, rpcPort);
    }

    checkAdmin(email, pass) {
        let _this = this
        return this.serviceRpc.invoke('/api/admin/checkAdmin', 'check-admin', { admin_email: email, admin_pass: pass })
            .then(function(result) {
                console.info("--result:", result)
                if (result) {
                    _this.serviceRpc.setUser(email, pass);
                    return true
                } else {
                    return false
                }
            })
    }

    setupApp(item) {
        return this.serviceRpc.invoke('/api/admin/setup-app', 'setup-app', { item: item, admin_email: window.sessionStorage.getItem('username'), admin_pass: window.sessionStorage.getItem('password') });
    }
    getConfigs() {
        return this.serviceRpc.invoke('/api/admin/get-configs', 'get-configs', { admin_email: window.sessionStorage.getItem('username'), admin_pass: window.sessionStorage.getItem('password') });
    }

    /**
     * get data for editors table
     */
    getEditorsList() {
        console.info("--window.sessionStorage.getItem('username'):", window.sessionStorage.getItem('username'))
        return this.serviceRpc.invoke('/api/admin/editors', 'get', { admin_email: window.sessionStorage.getItem('username'), admin_pass: window.sessionStorage.getItem('password') });
    }

    /**
     * add new user
     * @param name user name, eg: 'Jane Doe'
     * @param email user email, eg: 'example@example.com'
     * @param password user password, eg: 'dfgsdgdsfg' 
     */
    addEditor(name, email, password) {
        return this.serviceRpc.invoke('/api/admin/editors-add', 'post', {
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
        return this.serviceRpc.invoke('/api/admin/editors-edit', 'put', {
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
        return this.serviceRpc.invoke('/api/admin/editors-delete', 'delete', {
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
        return this.serviceRpc.invoke('/api/admin/resetPassword', 'code', { admin_email: email })
            .then(function() {
                return true;
            })
    }

    /**
     * TODO 
     * 
     */
    resetPass(email, code, pass) {
        return this.serviceRpc.invoke('/api/admin/resetPassword', 'reset-password', {
            admin_email: email,
            code: code,
            password: pass
        })
    }

}