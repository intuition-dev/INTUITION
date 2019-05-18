"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ver {
    ver() {
        return 'v5.06.05';
    }
}
exports.Ver = Ver;
const colors = require("colors");
const logger = require('tracer').colorConsole({
    filters: [
        {
            warn: colors.yellow,
            error: [colors.red]
        }
    ]
});
const Marpit = require("@marp-team/marpit");
const marpit = new Marpit.Marpit();
const fs = require("fs-extra");
const FileHound = require("filehound");
const yaml = require("js-yaml");
const path = require("path");
const findUp = require("find-up");
const riotc = require("riot-compiler");
const pug = require("pug");
const minify = require('html-minifier').minify;
const Terser = require("terser");
const download = require("download");
const beeper = require("beeper");
class DownloadFrag {
    constructor(dir, devops) {
        console.log('Extracting to', dir);
        if (!devops)
            download('https://unpkg.com/mtool-belt@1.0.14/template/headFrag.pug').then(data => {
                fs.writeFileSync(dir + '/headFrag.pug', data);
            });
        if (devops) {
            download('https://unpkg.com/mtool-belt@1.0.14/template/devOps.pug').then(data => {
                fs.writeFileSync(dir + '/devOps.pug', data);
            });
            download('https://unpkg.com/mtool-belt@1.0.14/template/devOps.js').then(data => {
                fs.writeFileSync(dir + '/devOps.js', data);
            });
        }
    }
}
exports.DownloadFrag = DownloadFrag;
const JavaScriptObfuscator = require("javascript-obfuscator");
const markdownItCont = require("markdown-it-container");
const md = require('markdown-it')({
    html: true,
    typographer: true,
    linkify: true
});
md.use(markdownItCont, 'dynamic', {
    validate: function () { return true; },
    render: function (tokens, idx) {
        let token = tokens[idx];
        if (token.nesting === 1) {
            return '\n<div class="' + token.info.trim() + '">';
        }
        else {
            return '</div>\n';
        }
    }
});
class Dirs {
    constructor(dir_) {
        let dir = Dirs.slash(dir_);
        this.dir = dir;
    }
    static slash(path_) {
        return path_.replace(/\\/g, '/');
    }
    static goUpOne(dir) {
        return path.resolve(dir, '..');
    }
    getInDir(sub) {
        const rec = FileHound.create()
            .paths(this.dir + sub)
            .not().glob("*.js")
            .findSync();
        let ret = [];
        const ll = this.dir.length + sub.length;
        for (let s of rec) {
            let n = s.substr(ll);
            if (n.includes('index.html'))
                continue;
            if (n.includes('index.pug'))
                continue;
            ret.push(n);
        }
        return ret;
    }
    getShort() {
        let lst = this.getFolders();
        let ret = [];
        const ll = this.dir.length;
        logger.info(this.dir, ll);
        for (let s of lst) {
            let n = s.substr(ll);
            ret.push(n);
        }
        return ret;
    }
    getFolders() {
        logger.info(this.dir);
        const rec = FileHound.create()
            .paths(this.dir)
            .ext('pug')
            .findSync();
        let ret = [];
        for (let val of rec) {
            val = Dirs.slash(val);
            let n = val.lastIndexOf('/');
            let s = val.substring(0, n);
            if (!fs.existsSync(s + '/dat.yaml'))
                continue;
            ret.push(s);
        }
        return Array.from(new Set(ret));
    }
}
exports.Dirs = Dirs;
class Dat {
    constructor(path__) {
        let path_ = Dirs.slash(path__);
        this._path = path_;
        let y;
        if (fs.existsSync(path_ + '/dat.yaml'))
            y = yaml.load(fs.readFileSync(path_ + '/dat.yaml'));
        if (!y)
            y = {};
        this.props = y;
        let keys = Object.keys(y);
        if (keys.includes('include'))
            this._addData();
    }
    write() {
        try {
            let y = yaml.dump(this.props, {
                skipInvalid: true,
                noRefs: true,
                noCompatMode: true,
                condenseFlow: true
            });
            let p = this._path + '/dat.yaml';
            logger.info(p);
            fs.writeFileSync(p, y);
        }
        catch (err) {
            logger.info(err);
        }
    }
    set(key, val) {
        this.props[key] = val;
    }
    _addData() {
        let jn = this.props.include;
        let fn = this._path + '/' + jn;
        logger.info(fn);
        let jso = fs.readFileSync(fn);
        Object.assign(this.props, JSON.parse(jso.toString()));
    }
    getAll() {
        return this.props;
    }
}
exports.Dat = Dat;
class MBake {
    bake(path_, prod) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                console.info('no path_ arg passed');
                reject('no path_ arg passed');
            }
            try {
                console.info(' Baking ' + path_);
                let d = new Dirs(path_);
                let dirs = d.getFolders();
                if (!dirs || dirs.length < 1) {
                    path_ = Dirs.goUpOne(path_);
                    console.info(' New Dir: ', path_);
                    d = new Dirs(path_);
                    dirs = d.getFolders();
                }
                for (let val of dirs) {
                    let n = new BakeWrk(val);
                    n.bake(prod);
                }
                resolve('OK');
            }
            catch (err) {
                logger.info(err);
                reject(err);
            }
        });
    }
    compsNBake(path_, prod) {
        let _this = this;
        return new Promise(async function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                console.info('no path_ arg passed');
                reject("no path args passed");
            }
            try {
                console.info(' Xomp ' + path_);
                let t = new Comps(path_);
                let lst = t.get();
                await t.comps(lst);
                _this.bake(path_, prod)
                    .then(function () {
                    resolve('OK');
                })
                    .catch(function (err) {
                    logger.info(err);
                    reject(err);
                });
            }
            catch (err) {
                logger.info(err);
                reject(err);
            }
        });
    }
    clearToProd(path_) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                console.info('no path_ arg passed');
                reject(('no path_ arg passed'));
            }
            try {
                console.info(' Clearing ' + path_);
                let dir = Dirs.slash(path_);
                const rec = FileHound.create()
                    .paths(dir)
                    .ext(['pug', 'yaml', 'js', 'ts', 'scss'])
                    .findSync();
                rec.forEach(file => {
                    const min = file.split('.')[file.split('.').length - 2] === 'min';
                    if (!min) {
                        console.info(' Removing ' + file);
                        fs.removeSync(file);
                    }
                });
            }
            catch (err) {
                logger.warn(err);
                reject(err);
            }
            resolve('OK');
        });
    }
    itemizeNBake(ppath_, prod) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            if (!ppath_ || ppath_.length < 1) {
                console.info('no path_ arg passed');
                reject('no path arg passed');
            }
            logger.info('ib:', ppath_);
            try {
                const i = new Items(ppath_);
                i.itemize();
            }
            catch (err) {
                logger.info(err);
                reject(err);
            }
            _this.bake(ppath_, prod)
                .then(function () { resolve('OK'); })
                .catch(function (err) {
                logger.info(err);
                reject(err);
            });
        });
    }
}
exports.MBake = MBake;
class BakeWrk {
    constructor(dir_) {
        let dir = Dirs.slash(dir_);
        this.dir = dir;
        console.info(' processing: ' + this.dir);
    }
    static metaMD(text, options) {
        console.info(' ', options);
        return md.render(text);
    }
    static marp(text, options) {
        console.info(' ', options);
        const { html, css } = marpit.render(text);
        return html;
    }
    static minify_pg(text, inline) {
        let code = text.match(/^\s*\s*$/) ? '' : text;
        let result = Terser.minify(code, BakeWrk.EsOptionsPg);
        if (result.error) {
            console.info('Terser error:', result.error);
            beeper();
            return text;
        }
        return result.code.replace(/;$/, '');
    }
    static sindexes(source, f) {
        if (!source)
            return [];
        if (!f)
            return [];
        let result = [];
        for (let i = 0; i < source.length; ++i) {
            if (source.substring(i, i + f.length) == f)
                result.push(i);
        }
        return result;
    }
    bake(prod) {
        let tstFile = this.dir + '/index.pug';
        if (!fs.existsSync(tstFile)) {
            return;
        }
        process.chdir(this.dir);
        let dat = new Dat(this.dir);
        let options = dat.getAll();
        options['filters'] = {
            metaMD: BakeWrk.metaMD,
            marp: BakeWrk.marp
        };
        options['ENV'] = prod;
        if (this.locAll(options))
            return ' ';
        this.writeFilePg(this.dir + '/index.pug', options, this.dir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', options, this.dir + '/m.html');
    }
    locAll(options) {
        if (!options.LOC)
            return false;
        let d = options.LOC;
        d = this.dir + d;
        let a;
        let fn = d + '/loc.yaml';
        if (fs.existsSync(fn))
            a = yaml.load(fs.readFileSync(fn));
        else {
            let dir2 = findUp.sync('loc.yaml', { cwd: d });
            a = yaml.load(fs.readFileSync(dir2));
            d = dir2.slice(0, -8);
        }
        const css = a.loc;
        const set = new Set(css);
        logger.info(set);
        let merged = Object.assign({}, a, options);
        for (let item of set) {
            this.do1Locale(item, merged);
        }
        fs.remove(this.dir + '/index.html');
    }
    do1Locale(locale, combOptions) {
        console.log(locale);
        let localeProps = {};
        localeProps['LOCALE'] = locale;
        for (let key in combOptions)
            if (key.endsWith('-' + locale)) {
                let len = key.length - ('-' + locale).length;
                let key2 = key.substring(0, len);
                localeProps[key2] = combOptions[key];
            }
        let locMerged = Object.assign({}, combOptions, localeProps);
        console.log(localeProps);
        let locDir = this.dir + '/' + locale;
        console.log(locDir);
        fs.ensureDirSync(locDir);
        if (fs.existsSync(locDir + '/loc.pug'))
            this.writeFilePg(locDir + '/loc.pug', locMerged, locDir + '/index.html');
        else
            this.writeFilePg(this.dir + '/index.pug', locMerged, locDir + '/index.html');
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', locMerged, locDir + '/m.html');
    }
    writeFilePg(source, options, target) {
        let html = pug.renderFile(source, options);
        const ver = '<!-- mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + ' -->';
        if (!options['pretty'])
            html = minify(html, BakeWrk.minifyPg);
        html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml);
        fs.writeFileSync(target, html);
    }
}
BakeWrk.ebodyHtml = '</body>';
BakeWrk.EsOptionsPg = {
    parse: { html5_comments: false },
    compress: { drop_console: true,
        keep_fargs: false, reduce_funcs: true },
    output: { beautify: false, indent_level: 0, quote_style: 3, semicolons: false },
    ecma: 5,
    mangle: false,
    keep_classnames: true,
    keep_fnames: true,
    safari10: true
};
BakeWrk.CompOptionsSimple = {
    compress: { drop_console: true,
        keep_fargs: true, reduce_funcs: false },
    output: { beautify: false, indent_level: 0, quote_style: 3, semicolons: false },
    ecma: 5,
    mangle: false,
    keep_classnames: true,
    keep_fnames: true,
    safari10: true
};
BakeWrk.minifyPg = {
    caseSensitive: true,
    collapseWhitespace: true,
    decodeEntities: true,
    minifyCSS: true,
    minifyJS: BakeWrk.minify_pg,
    quoteCharacter: "'",
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    sortAttributes: true,
    sortClassName: true
};
exports.BakeWrk = BakeWrk;
class Items {
    constructor(dir_) {
        let dir = Dirs.slash(dir_);
        let fn = dir + '/dat_i.yaml';
        if (!fs.existsSync(fn)) {
            let dir2 = findUp.sync('dat_i.yaml', { cwd: dir });
            if (dir2 != null) {
                dir = dir2.slice(0, -11);
            }
        }
        this.dir = dir;
        let d = new Dirs(dir);
        this.dirs = d.getFolders();
    }
    _addAnItem(dn) {
        try {
            if (!fs.existsSync(dn + '/dat.yaml'))
                return;
            let y = yaml.load(fs.readFileSync(dn + '/dat.yaml'));
            if (!y)
                return;
            if (false == y.publish) {
                return;
            }
            if (typeof y.publishDate !== 'undefined'
                && y.publishDate !== null
                && (y.publishDate - Date.now()) > 0) {
                return;
            }
            Items.clean(y);
            let dl = dn.lastIndexOf('/');
            let url = dn.substring(dl + 1);
            console.info('', url);
            y.url = url;
            if (!y.hasOwnProperty('id'))
                y.id = url;
            if (!this.feed.items)
                this.feed.items = [];
            y.index = this.feed.items.length;
            this.feed.items.push(y);
        }
        catch (err) {
            logger.info(err);
        }
    }
    itemize() {
        logger.info('Itemizing: ' + this.dir);
        const rootDir = this.dir;
        let fn = rootDir + '/dat_i.yaml';
        if (!fs.existsSync(fn))
            return;
        let y = yaml.load(fs.readFileSync((fn)));
        Items.clean(y);
        y.mbVer = new Ver().ver();
        this.feed = y;
        logger.warn(this.feed);
        for (let val of this.dirs) {
            this._addAnItem(val);
        }
        if (!this.feed.items)
            this.feed.items = [];
        if (0 == this.feed.items.length) {
            logger.info('no items');
            return;
        }
        this.feed.count = this.feed.items.length;
        let json = JSON.stringify(this.feed, null, 2);
        let items = rootDir + '/items.json';
        fs.writeFileSync(items, json);
        console.info(' processed.');
        return ' processed ';
    }
    static clean(o) {
        delete o['basedir'];
        delete o['ROOT'];
        delete o['pretty'];
        delete o['LOC'];
        delete o['publishFlag'];
    }
}
exports.Items = Items;
class Comps {
    constructor(dir_) {
        this.ver = '// mB ' + new Ver().ver() + ' on ' + new Date().toISOString() + '\r\n';
        let dir = Dirs.slash(dir_);
        this.dir = dir;
    }
    get() {
        const rec = FileHound.create()
            .paths(this.dir)
            .ext('pug')
            .glob('*-comp.pug')
            .findSync();
        let ret = [];
        for (let val of rec) {
            val = val.split('\\').join('/');
            ret.push(val);
        }
        return ret;
    }
    comps(list) {
        const THIZ = this;
        return new Promise(async function (resolve, reject) {
            console.info('Looking for comps: *-comp ' + THIZ.dir);
            for (let val of list) {
                let s = fs.readFileSync(val).toString();
                let n = val.lastIndexOf('/');
                let dir = val.substring(0, n);
                let name = val.substring(n);
                let p = name.lastIndexOf('.');
                name = name.substring(0, p);
                console.info(' ' + dir + name);
                await THIZ.process(s, dir, dir + name);
            }
            resolve('OK');
        });
    }
    static getCompOptions() {
        let t = {
            identifierNamesGenerator: 'hexadecimal',
            disableConsoleOutput: false,
            target: 'browser-no-eval',
            stringArray: true,
            stringArrayThreshold: 1,
            stringArrayEncoding: 'rc4',
            selfDefending: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.2
        };
        return t;
    }
    process(s, dir, fn) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            const r_options = { 'template': 'pug', 'basedir': dir };
            logger.info('compiling', fn);
            let js1;
            try {
                js1 = riotc.compile(s, r_options, fn);
            }
            catch (err) {
                beeper(1);
                logger.error('compiler error');
                logger.error(err);
                reject(err);
            }
            fs.writeFileSync(fn + '.js', js1);
            let js2 = Terser.minify(js1, BakeWrk.CompOptionsSimple);
            let ugs;
            try {
                logger.info('obs');
                ugs = JavaScriptObfuscator.obfuscate(js2.code, Comps.getCompOptions());
            }
            catch (err) {
                logger.error('error');
                logger.error(err);
                reject(err);
            }
            let obCode = THIZ.ver + ugs.getObfuscatedCode();
            fs.writeFileSync(fn + '.min.js', obCode);
            resolve('OK');
        });
    }
}
exports.Comps = Comps;
module.exports = {
    DownloadFrag, Dat, Dirs, BakeWrk, Items, Comps, Ver, MBake
};
