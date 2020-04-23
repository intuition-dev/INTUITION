"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend any classes!
Object.defineProperty(exports, "__esModule", { value: true });
class Ver {
    static ver() {
        return 'v8.21';
    }
    static date() {
        return new Date().toISOString();
    }
}
exports.Ver = Ver;
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB('base');
const path = require('path');
const Extra_1 = require("./Extra");
const FileOpsBase_1 = require("./FileOpsBase");
const { Dirs } = require('agentg/lib/FileOpsExtra');
const fs = require("fs-extra");
const yaml = require("js-yaml");
const findUp = require("find-up");
const pug = require("pug");
const minify = require('html-minifier').minify;
const Terser = require("terser");
// code /////////////////////////////////////////////////////////////////////
// metaMD Mad
const markdownItCont = require("markdown-it-container");
const mad = require('markdown-it')({
    html: true,
    typographer: true,
    linkify: true
}).use(require('markdown-it-imsize')); // eg![](main.jpg =50%x50%)
mad.use(markdownItCont, 'dynamic', {
    // https://github.com/markdown-it/markdown-it-container/issues/23
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
class MBake {
    bake(path_, prod) {
        return new Promise(function (resolve, reject) {
            if (!path_ || path_.length < 1) {
                log.info('no path_ arg passed');
                reject('no path_ arg passed');
            }
            try {
                log.info(' Baking ' + path_);
                let d = new Dirs(path_);
                let dirs = d.getFolders();
                if (!dirs || dirs.length < 1) {
                    //go one up
                    path_ = Dirs.goUpOne(path_);
                    log.info(' New Dir: ', path_);
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
                log.warn(err);
                reject(err);
            }
        }); //pro
    } //()
    // itemize and bake
    itemizeNBake(ppath_, prod) {
        let _this = this;
        return new Promise(function (resolve, reject) {
            if (!ppath_ || ppath_.length < 1) {
                log.warn('no path_ arg passed');
                reject('no path arg passed');
            }
            log.info('ib:', ppath_);
            try {
                const i = new JsonFeed(ppath_);
                i.itemize();
            }
            catch (err) {
                log.warn(err);
                reject(err);
            }
            _this.bake(ppath_, prod)
                .then(function () { resolve('OK'); })
                .catch(function (err) {
                log.warn(err);
                reject(err);
            });
        }); //pro
    } //()
} //()
exports.MBake = MBake;
class BakeWrk {
    constructor(dir_) {
        let dir = Dirs.slash(dir_);
        this.dir = dir;
        console.info(' processing: ' + this.dir);
    }
    static metaMD(text, options) {
        log.info(' ', options);
        return mad.render(text);
    }
    /*
    static marp(text, options) {//a custom md filter that uses a transformer
       log.info(' ', options)
       const { html, css } = marpit.render(text)
       return html
    }
    */
    static minify_pg(text, inline) {
        let code = text.match(/^\s*\s*$/) ? '' : text;
        let result = Terser.minify(code, Extra_1.MinJS.CompOptionsES);
        if (result.error) {
            log.warn('Terser error:', result.error);
            return text;
        }
        return result.code.replace(/;$/, '');
    }
    //find string indexes
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
        console.info(this.dir);
        let dat = new FileOpsBase_1.Dat(this.dir);
        //static data binding with a custom md filter that uses a transformer
        let options = dat.getAll();
        options['filters'] = {
            metaMD: BakeWrk.metaMD,
        };
        options['ENV'] = prod;
        //*GLOBAL yaml
        const global = options['GLO'];
        if (global) {
            const ps = this.dir + '/' + global;
            const p = path.normalize(ps + '/GLO.yaml');
            let glo = yaml.load(fs.readFileSync(p));
            options = Object.assign(glo, options);
            //log.info(options)
        } //()
        if (this.locAll(options)) // if locale, we are not writing here, but in sub folders.
            return ' ';
        this.writeFilePg(this.dir + '/index.pug', options, this.dir + '/index.html');
        //amp
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', options, this.dir + '/m.html');
    } //()
    // if loc, do locale
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
        // found
        const css = a.loc;
        const set = new Set(css);
        log.info(set);
        let merged = { ...a, ...options }; // es18 spread
        for (let item of set) {
            this.do1Locale(item, merged);
        }
        //delete 'root' index.html
        fs.remove(this.dir + '/index.html');
    } //()
    do1Locale(locale, combOptions) {
        //extract locale var
        console.info(locale);
        let localeProps = {};
        localeProps['LOCALE'] = locale; // any let can be access in pug or js  eg window.locale = '#{LOCALE}'
        for (let key in combOptions)
            if (key.endsWith('-' + locale)) { //for each key
                let len = key.length - ('-' + locale).length;
                let key2 = key.substring(0, len);
                localeProps[key2] = combOptions[key];
            }
        let locMerged = { ...combOptions, ...localeProps }; // es18 spread
        log.info(localeProps);
        // if dir not exists
        let locDir = this.dir + '/' + locale;
        log.info(locDir);
        fs.ensureDirSync(locDir);
        // if loc.pug exists
        if (fs.existsSync(locDir + '/loc.pug'))
            this.writeFilePg(locDir + '/loc.pug', locMerged, locDir + '/index.html');
        else
            this.writeFilePg(this.dir + '/index.pug', locMerged, locDir + '/index.html');
        //amp
        if (!fs.existsSync(this.dir + '/m.pug'))
            return ' ';
        this.writeFilePg(this.dir + '/m.pug', locMerged, locDir + '/m.html');
    }
    writeFilePg(source, options, target) {
        let html = pug.renderFile(source, options);
        const ver = '<!-- mB ' + Ver.ver() + ' on ' + Ver.date() + ' -->';
        if (!options['pretty'])
            html = minify(html, BakeWrk.minifyPg);
        html = html.replace(BakeWrk.ebodyHtml, ver + BakeWrk.ebodyHtml);
        fs.writeFileSync(target, html);
    }
} //class
exports.BakeWrk = BakeWrk;
BakeWrk.ebodyHtml = '</body>';
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
class JsonFeed {
    constructor(dir_) {
        let dir = Dirs.slash(dir_);
        let fn = dir + '/dat_i.yaml';
        if (!fs.existsSync(fn)) { //if it does not exist, go up a level
            let dir2 = findUp.sync('dat_i.yaml', { cwd: dir });
            if (dir2 != null) {
                dir = dir2.slice(0, -11); // this reported error for UBAYCAP
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
            //if publish property: true, skip static publishing regardless of publishDate
            if (false == y.publish) {
                return;
            }
            // if publishDate is set and later than now we skip
            if (typeof y.publishDate !== 'undefined'
                && y.publishDate !== null
                && (y.publishDate - Date.now()) > 0) {
                return;
            }
            JsonFeed.clean(y);
            let dl = dn.lastIndexOf('/');
            let url = dn.substring(dl + 1);
            log.info('', url);
            y.url = url;
            if (!y.hasOwnProperty('id'))
                y.id = url; //to be compliant to feed
            //array of items
            if (!this.feed.items)
                this.feed.items = [];
            y.index = this.feed.items.length;
            //log.info('', this.feed.items.length)
            this.feed.items.push(y);
        }
        catch (err) {
            log.warn(err);
        }
    }
    itemize() {
        console.info('Itemizing: ' + this.dir);
        const rootDir = this.dir;
        // header file
        let fn = rootDir + '/dat_i.yaml';
        if (!fs.existsSync(fn))
            return;
        let y = yaml.load(fs.readFileSync((fn)));
        JsonFeed.clean(y);
        y.mbVer = Ver.ver();
        this.feed = y;
        log.warn(this.feed);
        for (let val of this.dirs) {
            this._addAnItem(val);
        }
        if (!this.feed.items)
            this.feed.items = [];
        if (0 == this.feed.items.length) {
            log.info('no items');
            return;
        }
        this.feed.count = this.feed.items.length;
        //write
        let json = JSON.stringify(this.feed, null, 2);
        let items = rootDir + '/jsonfeed.json';
        fs.writeFileSync(items, json);
        log.info(' processed.');
        return ' processed ';
    }
    static clean(o) {
        delete o['basedir'];
        delete o['ROOT'];
        delete o['pretty'];
        delete o['LOC'];
        delete o['frags'];
    }
} //class
exports.JsonFeed = JsonFeed;
