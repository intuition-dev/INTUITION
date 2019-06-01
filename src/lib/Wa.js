"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Sa_1 = require("./Sa");
const FileOps_1 = require("./FileOps");
const express = require("express");
const chokidar = require("chokidar");
const reload = require("reload");
const cheerio = require("cheerio");
const interceptor = require("express-interceptor");
const logger = require('tracer').console();
const opn = require("open");
class Wa {
    static watch(dir, port, reloadPort) {
        port = port || 8090;
        let ss = new MDevSrv(dir, port, reloadPort);
        const mp = new MetaPro(dir);
        let ww = new Watch(mp, dir);
        ww.start(400);
        console.info(' Serving on ' + 'http://localhost:' + port);
        console.info(' --------------------------');
        console.info('');
        opn('http://localhost:' + port);
    }
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
        let path = FileOps_1.Dirs.slash(path_);
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
        const folder = FileOps_1.Dirs.slash(folder__);
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
module.exports = {
    Wa, MetaPro, Watch, MDevSrv
};
