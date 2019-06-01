"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const probe = require("probe-image-size");
const extractor = require("unfluff");
const axios_1 = __importDefault(require("axios"));
const logger = require('tracer').console();
const sm = require("sitemap");
const traverse = require("traverse");
const lunr = require("lunr");
const yaml = require("js-yaml");
const fs = require("fs-extra");
const FileHound = require("filehound");
const Base_1 = require("./Base");
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
    Scrape
};
