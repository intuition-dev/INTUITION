"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("Base");
const fbAdmin = require("firebase-admin");
const fs = require("fs");
const express = require("express");
const probe = require("probe-image-size");
const bsz = require("buffer-image-size");
const extractor = require("unfluff");
const axios_1 = require("axios");
const chokidar = require("chokidar");
const reload = require("reload");
const cheerio = require("cheerio");
const interceptor = require("express-interceptor");
const logger = require('tracer').console();
class Wa {
    static gwatch() {
        const path = require('path');
        const appDir = path.dirname(require.main.filename);
        const electron = require('electron');
        const proc = require('child_process');
        console.log(appDir);
        const fp = appDir + '../ewApp/main.js';
        const child = proc.spawn(electron, [fp, appDir]);
        child.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        child.on('exit', Wa.onWaExit);
    }
    static onWaExit() {
        console.log('Watcher child exited');
    }
}
exports.Wa = Wa;
class Watch {
    constructor(mp_, mount) {
        this.mp = mp_;
        this.root = mount;
    }
    start(poll_) {
        console.log(' watcher works best on linux, on ssh watched drives - that are S3 mounts');
        console.log(this.root);
        this.watcher = chokidar.watch(this.root, {
            ignored: '*.swpc*',
            ignoreInitial: true,
            cwd: this.root,
            usePolling: poll_,
            binaryInterval: 100000,
            interval: 50,
            atomic: 50,
            awaitWriteFinish: {
                stabilityThreshold: 100,
                pollInterval: 50
            }
        });
        this.watcher.unwatch('*.jpg');
        this.watcher.unwatch('*.html');
        this.watcher.unwatch('*.css');
        this.watcher.unwatch('*.swpc*');
        this.watcher.unwatch('*.js');
        let thiz = this;
        this.watcher.on('add', function (path) {
            thiz.auto(path);
        });
        this.watcher.on('change', function (path) {
            thiz.auto(path);
        });
    }
    refreshBro() {
        if (Watch.refreshPending)
            return;
        Watch.refreshPending = true;
        setTimeout(function () {
            console.log('reload');
            MDevSrv.reloadServer.reload();
            Watch.refreshPending = false;
        }, 20);
    }
    auto(path_) {
        let path = Base_1.Dirs.slash(path_);
        let p = path.lastIndexOf('/');
        let folder = '';
        let fn = path;
        if (p > 0) {
            folder = path.substring(0, p);
            fn = path.substr(p + 1);
        }
        try {
            logger.trace('WATCHED1:', folder + '/' + fn);
            this.mp.autoBake(folder, fn);
            this.refreshBro();
        }
        catch (err) {
            logger.warn(err);
        }
    }
}
Watch.refreshPending = false;
exports.Watch = Watch;
class MetaA {
    constructor(mount) {
        this.b = new Base_1.MBake();
        this.mount = mount;
        this.m = new Base_1.Map(this.mount);
        logger.trace('MetaPro', this.mount);
    }
    setLast(m) {
        this._lastMsg = new Base_1.RetMsg(m._cmd, m.code, m.msg);
    }
    getLastMsg() {
        let m = this._lastMsg;
        return new Base_1.RetMsg(m._cmd, 1, m.msg);
    }
    bake(dir) {
        let folder = this.mount + '/' + dir;
        logger.trace(folder);
        let msg = this.b.bake(folder);
        this.setLast(msg);
        return msg;
    }
    tagRoot() {
        return this.tag('/');
    }
    tag(dir) {
        let folder = this.mount + '/' + dir;
        logger.trace(folder);
        let msg = this.b.tag(folder);
        this.setLast(msg);
        return msg;
    }
    map() {
        let msg = this.m.gen();
        this.setLast(msg);
        return msg;
    }
    itemize(dir) {
        let msg = this.b.itemizeNBake(this.mount + '/' + dir);
        this.setLast(msg);
        return msg;
    }
    itemizeOnly(dir) {
        let msg = this.b.itemizeOnly(this.mount + '/' + dir);
        this.setLast(msg);
        return msg;
    }
    getItems(dir) {
        let s = fs.readFileSync(this.mount + '/' + dir + '/items.json', 'utf8');
        let msg = new Base_1.RetMsg(s, 1, 'success');
        this.setLast(msg);
        return msg;
    }
    autoBake(folder__, file) {
        const folder = Base_1.Dirs.slash(folder__);
        logger.trace('WATCHED2a:', folder);
        const ext = file.split('.').pop();
        if (ext == 'yaml')
            return this.itemize(folder);
        if (ext == 'md')
            return this.bake(folder);
        if (ext == 'pug') {
            if (file.indexOf('-tag') >= 0)
                return this.tag(folder);
            else
                return this.bake(folder);
        }
        let m = new Base_1.RetMsg(folder + '-' + file, -1, 'nothing to bake');
        this.setLast(m);
        return m;
    }
}
MetaA.folderProp = 'folder';
MetaA.srcProp = 'src';
MetaA.destProp = 'dest';
exports.MetaA = MetaA;
class FileOps {
    constructor(root_) {
        this.root = Base_1.Dirs.slash(root_);
    }
    clone(src, dest) {
        logger.trace('copy?');
        fse.copySync(this.root + src, this.root + dest);
        let p = this.root + dest;
        logger.trace(p);
        const d = new Dat(p);
        d.write();
        logger.trace('copy!');
        return new Base_1.RetMsg('clone', 1, dest);
    }
    write(destFile, txt) {
        logger.trace(this.root + destFile);
        fs.writeFileSync(this.root + destFile, txt);
    }
    read(file) {
        return fs.readFileSync(this.root + file).toString();
    }
    remove(path) {
        let dir_path = this.root + path;
        logger.trace('remove:' + dir_path);
        if (fs.existsSync(dir_path)) {
            fs.readdirSync(dir_path).forEach(function (entry) {
                fs.unlinkSync(dir_path + '/' + entry);
            });
            fs.rmdirSync(dir_path);
        }
    }
    removeFile(path) {
        let file_path = this.root + path;
        fs.unlinkSync(file_path);
    }
}
exports.FileOps = FileOps;
class MDevSrv {
    constructor(dir, port) {
        let app = express();
        logger.trace(dir, port);
        app.set('app port', port);
        MDevSrv.reloadServer = reload(app, { verbose: false, port: 9856 });
        app.set('views', dir);
        const bodyInterceptor = interceptor(function (req, res) {
            return {
                isInterceptable: function () {
                    return /text\/html/.test(res.get('Content-Type'));
                },
                intercept: function (body, send) {
                    console.log(' h');
                    let $document = cheerio.load(body);
                    $document('body').prepend('<script src="/reload/reload.js"></script>');
                    send($document.html());
                }
            };
        });
        const timeInterceptor = interceptor(function (req, res) {
            return {
                isInterceptable: function () {
                    let js = /application\/javascript/.test(res.get('Content-Type'));
                    let cs = /text\/css/.test(res.get('Content-Type'));
                    let img = /image\/jpg/.test(res.get('Content-Type'));
                    return cs || js || img;
                },
                intercept: function (body, send) {
                    setTimeout(function () { send(body); }, Math.floor(Math.random() * 200) + 50);
                }
            };
        });
        app.use(bodyInterceptor);
        app.use(timeInterceptor);
        app.use(express.static(dir));
        app.listen(port, function () {
            logger.trace('dev srv ' + port);
        });
    }
}
exports.MDevSrv = MDevSrv;
class Scrape {
    constructor() {
        axios_1.default.defaults.responseType = 'document';
    }
    s(url) {
        return new Promise(function (resolve, reject) {
            try {
                console.log(url);
                axios_1.default.get(url).then(function (response) {
                    let data = extractor.lazy(response.data);
                    let ret = new Object();
                    ret['title'] = data.softTitle();
                    ret['content_text'] = data.description();
                    ret['image'] = data.image();
                    ret['title'] = Scrape.alphaNumeric(ret['title']);
                    ret['content_text'] = Scrape.alphaNumeric(ret['content_text']);
                    resolve(ret);
                });
            }
            catch (err) {
                logger.warn(err);
                reject(err);
            }
        });
    }
    static getImageSize(iurl_) {
        logger.trace(iurl_);
        return probe(iurl_, { timeout: 3000 });
    }
    static alphaNumeric(str) {
        if (!str)
            return '';
        const alpha_numeric = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + ' ');
        let filterd_string = '';
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            let index = alpha_numeric.indexOf(char);
            if (index > -1) {
                filterd_string += alpha_numeric[index];
            }
        }
        return filterd_string;
    }
    static getBufferImageSize(buf_) {
        return bsz(buf_);
    }
}
exports.Scrape = Scrape;
class AdminSrv {
    constructor(config) {
        let dir = config['admin_www'];
        let port = config['admin_port'];
        let app = express();
        logger.trace(dir, port);
        app.set('admin port', port);
        let fbServiceAccount = new Object(JSON.parse(fs.readFileSync(config['firebase_config']).toString()));
        app.set('views', dir);
        app.use(express.static(dir));
        app.listen(port, function () {
            logger.trace('admin app' + port);
        });
    }
}
exports.AdminSrv = AdminSrv;
class AdminFireUtil {
    constructor(config) {
        this.fbApp = null;
        let fbServiceAccount = new Object(JSON.parse(fs.readFileSync(config['firebase_config']).toString()));
        this.fbApp = fbAdmin.initializeApp({
            credential: fbAdmin.credential.cert(fbServiceAccount)
        });
    }
    deleteAuthUser(uid) {
        console.log('deleteAuthUser' + uid);
        return fbAdmin.auth().deleteUser(uid);
    }
}
exports.AdminFireUtil = AdminFireUtil;
module.exports = {
    Wa, AdminFireUtil, AdminSrv, Scrape, MetaA, Watch, FileOps
};
