"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Sa_1 = require("./Sa");
const fs = require("fs-extra");
const FileHound = require("filehound");
const yaml = require("js-yaml");
const sm = require("sitemap");
const traverse = require("traverse");
const lunr = require("lunr");
const express = require("express");
const probe = require("probe-image-size");
const extractor = require("unfluff");
const axios_1 = require("axios");
const chokidar = require("chokidar");
const reload = require("reload");
const cheerio = require("cheerio");
const interceptor = require("express-interceptor");
const logger = require('tracer').console();
const csv2JsonV2 = require("csvtojson");
const opn = require("open");
class Wa {
    static watch(dir, port, reloadPort) {
        port = port || 8090;
        let ss = new MDevSrv(dir, port, reloadPort);
        const mp = new MetaPro(dir);
        let ww = new Watch(mp, dir);
        ww.start(150);
        console.info(' Serving on ' + 'http://localhost:' + port);
        console.info(' --------------------------');
        console.info('');
        opn('http://localhost:' + port);
    }
}
exports.Wa = Wa;
class CSV2Json {
    constructor(dir_) {
        if (!dir_ || dir_.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this.dir = Base_1.Dirs.slash(dir_);
    }
    convert() {
        let fn = this.dir + '/list.csv';
        if (!fs.existsSync(fn)) {
            let r = new Base_1.RetMsg('CSV2Json', -1, 'list.csv not found in ' + this.dir);
            console.info('not found', r);
            return r;
        }
        let r = new Base_1.RetMsg('CSV2Json', 1, 'OK');
        let thiz = this;
        logger.info('1');
        csv2JsonV2({ noheader: true }).fromFile(fn)
            .then(function (jsonO) {
            logger.info(jsonO);
            let fj = thiz.dir + '/list.json';
            fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3));
            return r;
        });
    }
}
exports.CSV2Json = CSV2Json;
class Watch {
    constructor(mp_, mount) {
        this.mp = mp_;
        this.root = mount;
    }
    start(delay_) {
        this.delay = delay_;
        console.info(' watcher starting');
        console.info(this.root);
        this.watcher = chokidar.watch(this.root, {
            ignored: '*.swpc*',
            ignoreInitial: true,
            cwd: this.root,
            usePolling: true,
            useFsEvents: false,
            binaryInterval: delay_ * 5,
            interval: delay_,
            atomic: delay_,
            awaitWriteFinish: {
                stabilityThreshold: delay_ * 2.11,
                pollInterval: delay_ * .7
            }
        });
        this.watcher.unwatch('*.html');
        this.watcher.unwatch('*.swpc*');
        this.watcher.unwatch('*.min*');
        this.watcher.unwatch('*.min.js');
        this.watcher.unwatch('*.css');
        this.watcher.unwatch('.DS_Store');
        this.watcher.unwatch('.gitignore');
        this.watcher.unwatch('.git');
        let thiz = this;
        this.watcher.on('add', function (path) {
            Watch.debounce(thiz.auto(path), this.delay * 2.2);
        });
        this.watcher.on('change', function (path) {
            Watch.debounce(thiz.auto(path), this.delay * 2.2);
        });
    }
    static debounce(func, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
            };
            var callNow = !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }
    refreshBro() {
        Watch.debounce(MDevSrv.reloadServer.reload(), this.delay * 1.1);
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
            logger.info('WATCHED1:', folder + '/' + fn);
            this.mp.autoBake(folder, fn);
            this.refreshBro();
        }
        catch (err) {
            logger.warn(err);
        }
    }
}
exports.Watch = Watch;
class MetaPro {
    constructor(mount) {
        this.b = new Base_1.MBake();
        this.mount = mount;
        this.m = new Map(this.mount);
        logger.info('MetaPro', this.mount);
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
        logger.info(folder);
        let msg = this.b.bake(folder);
        this.setLast(msg);
        return msg;
    }
    compsRoot() {
        return this.comps('/');
    }
    comps(dir) {
        let folder = this.mount + '/' + dir;
        logger.info(folder);
        let msg = this.b.comps(folder, true, this.mount);
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
    css(dir) {
        new Sa_1.Sas().css(this.mount + '/' + dir);
        let msg = new Base_1.RetMsg('css', 1, 'success');
        this.setLast(msg);
        return msg;
    }
    js(dir) {
        const folder = this.mount + '/' + dir;
        const js = new Sa_1.MinJS(folder);
        js.ts(folder);
        let msg = new Base_1.RetMsg('js', 1, 'success');
        this.setLast(msg);
        return msg;
    }
    minJS(dir) {
        const folder = this.mount + '/' + dir;
        const js = new Sa_1.MinJS(folder);
        js.min(folder);
        let msg = new Base_1.RetMsg('min.js', 1, 'success');
        this.setLast(msg);
        return msg;
    }
    autoBake(folder__, file) {
        const folder = Base_1.Dirs.slash(folder__);
        const ext = file.split('.').pop();
        logger.info('WATCHED2a:', folder, ext);
        if (ext == 'scss' || ext == 'sass')
            return this.css(folder);
        if (ext == 'ts')
            return this.js(folder);
        if (ext == 'yaml')
            return this.itemize(folder);
        if (ext == 'md')
            return this.bake(folder);
        if (ext == 'pug') {
            if (file.indexOf('-comp') >= 0)
                return this.comps(folder);
            else
                return this.bake(folder);
        }
    }
}
MetaPro.folderProp = 'folder';
MetaPro.srcProp = 'src';
MetaPro.destProp = 'dest';
exports.MetaPro = MetaPro;
class MDevSrv {
    constructor(dir, port, reloadPort) {
        let app = express();
        logger.info(dir, port);
        app.set('app port', port);
        const rport = Number(reloadPort) || 9856;
        reload(app, { verbose: false, port: rport })
            .then((reloadServer_) => {
            MDevSrv.reloadServer = reloadServer_;
            logger.info('reloadServer');
        }).catch(e => {
            console.log('==================e', e);
        });
        app.set('views', dir);
        const bodyInterceptor = interceptor(function (req, res) {
            return {
                isInterceptable: function () {
                    return /text\/html/.test(res.get('Content-Type'));
                },
                intercept: function (body, send) {
                    console.info(' .');
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
            logger.info('dev srv ' + port);
        });
    }
}
exports.MDevSrv = MDevSrv;
class FileOps {
    constructor(root_) {
        this.root = Base_1.Dirs.slash(root_);
    }
    count(fileAndExt) {
        const files = FileHound.create()
            .paths(this.root)
            .depth(0)
            .match(fileAndExt + '*')
            .findSync();
        return files.length;
    }
    clone(src, dest) {
        logger.info('copy?');
        fs.copySync(this.root + src, this.root + dest);
        let p = this.root + dest;
        logger.info(p);
        const d = new Base_1.Dat(p);
        d.write();
        logger.info('copy!');
        return new Base_1.RetMsg('clone', 1, dest);
    }
    write(destFile, txt) {
        logger.info(this.root + destFile);
        fs.writeFileSync(this.root + destFile, txt);
    }
    read(file) {
        return fs.readFileSync(this.root + file).toString();
    }
    remove(path) {
        let dir_path = this.root + path;
        logger.info('remove:' + dir_path);
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
class Map {
    constructor(root) {
        if (!root || root.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this._root = root;
    }
    gen() {
        const m = yaml.load(fs.readFileSync(this._root + '/map.yaml'));
        let jmenu = JSON.stringify(m.menu, null, 2);
        fs.writeFileSync(this._root + '/menu.json', jmenu);
        this._sitemap = sm.createSitemap({
            hostname: m['host']
        });
        let leaves = traverse(m.menu).reduce(function (acc, x) {
            if (this.isLeaf)
                acc.push(x);
            return acc;
        }, []);
        let itemsRoot = m['itemsRoot'];
        if (itemsRoot) {
            const d = new Base_1.Dirs(this._root + itemsRoot);
            leaves = leaves.concat(d.getFolders());
        }
        let arrayLength = leaves.length;
        logger.info(arrayLength);
        for (let i = 0; i < arrayLength; i++) {
            try {
                let path = leaves[i];
                if (path.includes(this._root))
                    path = path.replace(this._root, '');
                let fullPath = this._root + path;
                let dat = new Base_1.Dat(fullPath);
                let props = dat.getAll();
                logger.info(path);
                let priority = props['priority'];
                if (!priority)
                    priority = 0.3;
                let image = props['image'];
                if (!image) {
                    this._sitemap.add({
                        url: path,
                        changefreq: m['changefreq'],
                        priority: priority
                    });
                }
                else {
                    this._sitemap.add({
                        url: path,
                        changefreq: m['changefreq'],
                        priority: priority,
                        img: [{
                                url: image,
                                title: props['title'],
                                caption: props['title']
                            }]
                    });
                }
            }
            catch (err) {
                logger.info(err);
            }
        }
        const thiz = this;
        this._sitemap.toXML(function (err, xml) {
            fs.writeFileSync(thiz._root + '/sitemap.xml', xml);
            console.info(' Sitemap ready');
            thiz._map(leaves);
        });
        return new Base_1.RetMsg(thiz._root + ' map', 1, 'ok');
    }
    _map(leaves) {
        let documents = [];
        let arrayLength = leaves.length;
        for (let i = 0; i < arrayLength; i++) {
            try {
                let path = leaves[i];
                if (path.includes(this._root))
                    path = path.replace(this._root, '');
                let fullPath = this._root + path;
                const rec = FileHound.create()
                    .paths(fullPath)
                    .ext('md')
                    .findSync();
                let text = '';
                for (let val of rec) {
                    val = Base_1.Dirs.slash(val);
                    console.info(val);
                    let txt1 = fs.readFileSync(val, "utf8");
                    text = text + ' ' + txt1;
                }
                const row = {
                    id: path,
                    body: text
                };
                documents.push(row);
            }
            catch (err) {
                logger.info(err);
            }
        }
        logger.info(documents.length);
        let idx = lunr(function () {
            this.ref('id');
            this.field('body');
            documents.forEach(function (doc) {
                this.add(doc);
            }, this);
        });
        const jidx = JSON.stringify(idx);
        fs.writeFileSync(this._root + '/FTS.idx', jidx);
        console.info(' Map generated menu.json, sitemap.xml and FTS.idx(json) index in ' + this._root);
    }
}
exports.Map = Map;
class Scrape {
    constructor() {
        axios_1.default.defaults.responseType = 'document';
    }
    s(url) {
        return new Promise(function (resolve, reject) {
            try {
                console.info(url);
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
        logger.info(iurl_);
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
}
exports.Scrape = Scrape;
module.exports = {
    Wa, MetaPro, Watch, FileOps, MDevSrv, CSV2Json,
    Scrape
};
