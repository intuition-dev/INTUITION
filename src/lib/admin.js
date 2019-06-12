"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Serv_1 = require("mbake/lib/Serv");
const FileOpsExtra_1 = require("mbake/lib/FileOpsExtra");
const Email_1 = require("./Email");
var path = require('path');
class AdminRoutes {
    routes(adbDB) {
        const emailJs = new Email_1.Email();
        const bodyParser = require("body-parser");
        const adminApp = Serv_1.ExpressRPC.makeInstance(['http://localhost:9081']);
        adminApp.use(bodyParser.json());
        adminApp.use((request, response, next) => {
            if (request.path === '/resetPassword') {
                next();
            }
            const params = JSON.parse(request.fields.params);
            const resp = {};
            let email = params.admin_email;
            let password = params.admin_pass;
            return adbDB.validateEmail(email, password)
                .then(function (pass) {
                resp.result = {};
                if (pass) {
                    response.locals.email = email;
                    return next();
                }
                else {
                    resp.errorLevel = -1;
                    resp.result = false;
                    return response.json(resp);
                }
            }).catch(function (error) {
                resp.errorLevel = -1;
                resp.errorMessage = error;
                resp.result = false;
                return response.json(resp);
            });
        });
        adminApp.post('/checkAdmin', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let password = params.admin_pass;
            let resp = {};
            if ('check-admin' == method) {
                resp.result = {};
                try {
                    resp.result = true;
                    return res.json(resp);
                }
                catch (err) {
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post('/setup-shop', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let pathToShop = params.pathToShop;
            let snipcartApi = params.snipcartApi;
            let resp = {};
            console.log('-------res.locals', res.locals.email);
            if ('setup-shop' == method) {
                resp.result = {};
                try {
                    new FileOpsExtra_1.Download('CMS', path.join(__dirname, '../')).autoZ();
                    resp.result = true;
                    return res.json(resp);
                }
                catch (err) {
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post('/resetPassword', (req, res) => {
            const method = req.fields.method;
            let params = JSON.parse(req.fields.params);
            let email = params.admin_email;
            let resp = {};
            if ('code' == method) {
                resp.result = {};
                try {
                    var code = adbDB.sendVcode(email)
                        .then(function (code) {
                        adbDB.getEmailJsSettings()
                            .then(settings => {
                            let setting = settings[0];
                            emailJs.send(email, setting.emailjsService_id, setting.emailjsTemplate_id, setting.emailjsUser_id, 'your code: ' + code);
                            resp.result = true;
                            return res.json(resp);
                        });
                    });
                }
                catch (err) {
                }
            }
            else if ('reset-password' == method) {
                resp.result = {};
                adbDB.resetPassword(email, params.code, params.password)
                    .then(function (result) {
                    resp.result = result;
                    return res.json(resp);
                });
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            if ('get' == method) {
                adbDB.getEditors()
                    .then(function (editors) {
                    console.info("--editors:", editors);
                    let data = [];
                    editors.map(function (editor) {
                        data.push({
                            id: editor.id,
                            email: editor.email,
                            name: editor.name
                        });
                    });
                    resp.result = data;
                    return res.json(resp);
                });
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors-add", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('post' == method) {
                let email = params.email;
                let name = params.name;
                let password = params.password;
                if (typeof email !== 'undefined' &&
                    typeof name !== 'undefined' &&
                    typeof password !== 'undefined') {
                    adbDB.addEditor(email, name, password)
                        .then(function (editorId) {
                        let response = {
                            id: editorId
                        };
                        resp.result = response;
                        return res.json(resp);
                    });
                }
                else {
                    res.status(400);
                    resp.result = { error: 'parameters missing' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors-edit", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('put' == method) {
                let name = params.name;
                let userId = params.uid;
                if (typeof name !== 'undefined' &&
                    typeof userId !== 'undefined') {
                    adbDB.editEditor(name, userId)
                        .then(function (editorId) {
                        console.info("--editorId:", editorId);
                        let response = {
                            id: editorId
                        };
                        resp.result = response;
                        return res.json(resp);
                    });
                }
                else {
                    res.status(400);
                    resp.result = { error: 'parameters missing' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        adminApp.post("/editors-delete", (req, res) => {
            const method = req.fields.method;
            let resp = {};
            let params = JSON.parse(req.fields.params);
            if ('delete' == method) {
                let userId = params.uid;
                if (typeof userId !== 'undefined') {
                    adbDB.deleteEditor(userId)
                        .then(function (editorId) {
                        console.info("--editor have been removed:", editorId);
                        resp.result = {};
                        res.json(resp);
                    })
                        .catch(function (error) {
                        res.status(400);
                        resp.result = { error: error.message };
                        res.json(resp);
                    });
                }
                else {
                    res.status(400);
                    resp.result = { error: 'parameters missing' };
                    res.json(resp);
                }
            }
            else {
                return res.json(resp);
            }
        });
        return adminApp;
    }
    ;
}
exports.AdminRoutes = AdminRoutes;
module.exports = {
    AdminRoutes
};
