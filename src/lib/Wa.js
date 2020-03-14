"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
// NOTE: You can extend these classes!
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Extra_1 = require("./Extra");
const { Dirs } = require('agentg/lib/FileOpsExtra');
const express = require("express");
const chokidar = require("chokidar");
const reload = require("reload");
const cheerio = require("cheerio");
const interceptor = require("express-interceptor");
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB("WA");
const opn = require("open");
// watch: /////////////////////////////////////////////////////////////////////////////////////////////////
class Wa {
    static watch(dir, port, reloadPort) {
        port = port || 8090;
        let ss = new MDevSrv(dir, port, reloadPort);
        const mp = new MetaPro(dir);
        let ww = new Watch(mp, dir);
        ww.start(250); // build x ms after saving a file
        console.info(' Serving on ' + 'http://localhost:' + port);
        log.info(' --------------------------');
        log.info('');
        opn('http://localhost:' + port);
    } //()
}
exports.Wa = Wa;
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
        log.info(' watcher starting');
        log.info(this.root);
        let watchList = [];
        watchList.push(this.root + '/**/*.md');
        watchList.push(this.root + '/**/*.ts');
        watchList.push(this.root + '/**/*.pug');
        watchList.push(this.root + '/**/*.scss');
        watchList.push(this.root + '/**/*.sass');
        watchList.push(this.root + '/**/*.yaml');
        watchList.push(this.root + '/**/*.js');
        watchList.push(this.root + '/**/*.json');
        watchList.push(this.root + '/**/*.css');
        log.info(watchList);
        this.watcher = chokidar.watch(watchList, {
            ignoreInitial: true,
            cwd: this.root,
            usePolling: true,
            useFsEvents: false,
            binaryInterval: delay_ * 5,
            interval: delay_ //time
            ,
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
    } //()
    refreshBro() {
        MDevSrv.reloadServer.reload();
    }
    async autoNT(path_, wa) {
        log.info(wa);
        let path = Dirs.slash(path_);
        let p = path.lastIndexOf('/');
        let folder = '';
        let fn = path;
        if (p > 0) {
            folder = path.substring(0, p);
            fn = path.substr(p + 1);
        }
        try {
            log.info('WATCHED1:', folder + '/' + fn);
            await this.mp.autoBake(folder, fn);
            await this.refreshBro();
        }
        catch (err) {
            log.warn(err);
        }
    } //()
} //class
exports.Watch = Watch;
class MetaPro {
    constructor(mount) {
        this.b = new Base_1.MBake();
        this.mount = mount;
        log.info('MetaPro', this.mount);
    }
    bake(dir) {
        let folder = this.mount + '/' + dir;
        log.info(folder);
        return this.b.bake(folder, 0);
    }
    itemize(dir) {
        return this.b.itemizeNBake(this.mount + '/' + dir, 0);
    }
    css(dir) {
        return new Extra_1.Sas().css(this.mount + '/' + dir);
    }
    ts(dir) {
        const folder = this.mount + '/' + dir;
        const js = new Extra_1.MinJS();
        return js.ts(folder);
    }
    // when you pass the file name, ex: watch
    async autoBake(folder__, file) {
        const folder = Dirs.slash(folder__);
        const ext = file.split('.').pop();
        log.info('WATCHED2:', folder, ext);
        if (ext == 'scss' || ext == 'sass') // css
            return await this.css(folder);
        if (ext == 'ts') // ts
            return await this.ts(folder);
        if (ext == 'yaml') // bake and itemize
            return await this.itemize(folder);
        if (ext == 'md')
            return await this.bake(folder);
        if (ext == 'pug') {
            return await this.bake(folder);
        }
        return ('Cant process ' + ext);
    } //()
} //class
exports.MetaPro = MetaPro;
MetaPro.folderProp = 'folder';
MetaPro.srcProp = 'src';
MetaPro.destProp = 'dest';
// Meta: //////////////////////
class MDevSrv {
    constructor(dir, port, reloadPort) {
        let app = express();
        log.info(dir, port);
        app.set('app port', port);
        const rport = Number(reloadPort) || 9856;
        reload(app, { verbose: false, port: rport })
            .then((reloadServer_) => {
            MDevSrv.reloadServer = reloadServer_;
            log.info('reloadServer');
        }).catch(e => {
            log.info('==================e', e);
        });
        app.set('views', dir);
        const bodyInterceptor = interceptor(function (req, res) {
            return {
                // Only HTML responses will be intercepted
                isInterceptable: function () {
                    return /text\/html/.test(res.get('Content-Type'));
                },
                intercept: function (body, send) {
                    //log.info(' .')
                    let $document = cheerio.load(body);
                    $document('body').prepend('<script src="/reload/reload.js"></script>');
                    send($document.html());
                }
            };
        });
        app.use(bodyInterceptor);
        app.use(express.static(dir));
        app.listen(port, function () {
            log.info('dev srv ' + port);
        });
    } //()
} //class
exports.MDevSrv = MDevSrv;
