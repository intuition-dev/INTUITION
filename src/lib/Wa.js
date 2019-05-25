"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
const axios_1 = __importDefault(require("axios"));
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
        ww.start(300);
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
        return new Promise(function (resolve, reject) {
            let fn = this.dir + '/list.csv';
            if (!fs.existsSync(fn)) {
                console.info('not found');
                reject('not found');
            }
            let thiz = this;
            logger.info('1');
            csv2JsonV2({ noheader: true }).fromFile(fn)
                .then(function (jsonO) {
                logger.info(jsonO);
                let fj = thiz.dir + '/list.json';
                fs.writeFileSync(fj, JSON.stringify(jsonO, null, 3));
                resolve('OK');
            });
        });
    }
}
exports.CSV2Json = CSV2Json;
class Watch {
    constructor(mp_, mount) {
        this.mp = mp_;
        if (mount.endsWith('/.')) {
            mount = mount.slice(0, -1);
        }
        this.root = mount;
    }
    start(delay_) {
        this.delay = delay_;
        console.info(' watcher starting');
        console.info(this.root);
        let watchList = [];
        watchList.push(this.root + '/**/*.md');
        watchList.push(this.root + '/**/*.ts');
        watchList.push(this.root + '/**/*.pug');
        watchList.push(this.root + '/**/*.scss');
        watchList.push(this.root + '/**/*.sass');
        watchList.push(this.root + '/**/*.yaml');
        watchList.push(this.root + '/**/*.js');
        logger.trace(watchList);
        this.watcher = chokidar.watch(watchList, {
            ignoreInitial: true,
            cwd: this.root,
            usePolling: true,
            useFsEvents: false,
            binaryInterval: delay_ * 5,
            interval: delay_,
            atomic: delay_,
            awaitWriteFinish: {
                stabilityThreshold: delay_ * 1.2,
                pollInterval: delay_ * .5
            }
        });
        let thiz = this;
        this.watcher.on('add', async function (path) {
            await thiz.autoNT(path, 'a');
        });
        this.watcher.on('change', async function (path) {
            await thiz.autoNT(path, 'c');
        });
    }
    refreshBro() {
        MDevSrv.reloadServer.reload();
    }
    async autoNT(path_, wa) {
        console.log(wa);
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
            await this.mp.autoBake(folder, fn);
            await this.refreshBro();
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
    bake(dir) {
        let folder = this.mount + '/' + dir;
        logger.info(folder);
        return this.b.bake(folder, 0);
    }
    comps(dir) {
        let folder = this.mount + '/' + dir;
        logger.info(folder);
        return this.b.compsNBake(folder, 0);
    }
    map() {
        return this.m.gen();
    }
    itemize(dir) {
        return this.b.itemizeNBake(this.mount + '/' + dir, 0);
    }
    css(dir) {
        return new Sa_1.Sas().css(this.mount + '/' + dir);
    }
    ts(dir) {
        const folder = this.mount + '/' + dir;
        const js = new Sa_1.MinJS();
        return js.ts(folder);
    }
    async autoBake(folder__, file) {
        const folder = Base_1.Dirs.slash(folder__);
        const ext = file.split('.').pop();
        logger.info('WATCHED2:', folder, ext);
        if (ext == 'scss' || ext == 'sass')
            return await this.css(folder);
        if (ext == 'ts')
            return await this.ts(folder);
        if (ext == 'yaml')
            return await this.itemize(folder);
        if (ext == 'md')
            return await this.bake(folder);
        if (ext == 'pug') {
            if (file.indexOf('-comp') >= 0)
                return await this.comps(folder);
            else
                return await this.bake(folder);
        }
        return ('Cant process ' + ext);
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
        return new Promise((resolve, reject) => {
            logger.info('copy?');
            fs.copySync(this.root + src, this.root + dest);
            let p = this.root + dest;
            logger.info(p);
            const d = new Base_1.Dat(p);
            d.write();
            logger.info('copy!');
            resolve('OK');
        });
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
        return new Promise(function (resolve, reject) {
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
            resolve('OK');
        });
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
    static __getImageSize(iurl_) {
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
