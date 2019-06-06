"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const FileOpsBase_1 = require("./FileOpsBase");
const FileHound = require("filehound");
const execa = require('execa');
const logger = require('tracer').console();
const fs = require("fs-extra");
const csv2JsonV2 = require("csvtojson");
const AdmZip = require("adm-zip");
const download = require("download");
const yaml = require("js-yaml");
const node_firestore_import_export_1 = require("node-firestore-import-export");
const firebase = __importStar(require("firebase-admin"));
class DownloadFrag {
    constructor(dir, ops) {
        console.log('Extracting to', dir);
        if (!ops) {
            new Download('headFrag', dir).auto();
        }
        if (ops) {
            new Download('opsPug', dir).auto();
            new Download('opsJs', dir).auto();
        }
    }
}
exports.DownloadFrag = DownloadFrag;
class VersionNag {
    static isCurrent() {
        const down = new Download('mbake', null);
        return down.checkVer();
    }
}
exports.VersionNag = VersionNag;
class Download {
    constructor(key_, targetDir_) {
        this.key = key_;
        this.targetDir = targetDir_;
    }
    auto() {
        const THIZ = this;
        this.getVal().then(function (url) {
            const fn1 = THIZ.getFn(url);
            THIZ.down(url, fn1);
        });
    }
    checkVer() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.getVal().then(function (ver) {
                logger.trace(ver);
                if (ver == Base_1.Ver.ver())
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
    getVal() {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(Download.truth).then(data => {
                let dic = yaml.load(data);
                resolve(dic[THIZ.key]);
            });
        });
    }
    getFn(url) {
        const pos = url.lastIndexOf('/');
        return url.substring(pos);
    }
    down(url, fn) {
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            download(url).then(data => {
                fs.writeFileSync(THIZ.targetDir + '/' + fn, data);
                resolve('OK');
            });
        });
    }
    unzip(fn) {
        let zip = new AdmZip(this.targetDir + '/' + fn);
        zip.extractAllTo(this.targetDir, true);
    }
}
Download.truth = 'https://metabake.github.io/mBakeCLI/versions.yaml';
exports.Download = Download;
class Static {
    constructor(jsonUrl, partentFodler, templatePg) {
    }
}
exports.Static = Static;
class YamlConfig {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn));
        console.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class CSV2Json {
    constructor(dir_) {
        if (!dir_ || dir_.length < 1) {
            console.info('no path arg passed');
            return;
        }
        this.dir = FileOpsBase_1.Dirs.slash(dir_);
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
class FileOps {
    constructor(root_) {
        this.root = FileOpsBase_1.Dirs.slash(root_);
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
            const d = new FileOpsBase_1.Dat(p);
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
class GitDown {
    constructor(pass_) {
        var standard_input = process.stdin;
        standard_input.setEncoding('utf-8');
        console.log("Please input text in command line.");
        standard_input.on('data', (password) => {
            if (password === 'exit\n') {
                console.log("Please, enter your git password.");
                process.exit();
            }
            else {
                console.log('password', password);
                const last = pass_.lastIndexOf('/');
                this.pass = password.replace(/\n/g, '');
                this.dir = pass_.substring(0, last);
                this.config = yaml.load(fs.readFileSync('gitdown.yaml'));
                console.log(this.dir, this.config.BRANCH);
                logger.trace(this.config);
                this.remote = 'https://' + this.config.LOGINName + ':';
                this.remote += this.pass + '@';
                this.remote += this.config.REPO + '/';
                this.remote += this.config.PROJECT;
                this._emptyFolders();
                this.process();
            }
        });
    }
    async process() {
        try {
            let b = this.config.BRANCH;
            await this._branchExists(b);
            console.log(this.exists);
            if (this.exists)
                await this._getEXISTINGRemoteBranch(b);
            else
                await this._getNEWRemoteBranch(b);
            this._moveTo(b);
        }
        catch (err) {
            console.error(err);
            process.exit();
        }
    }
    _moveTo(branch) {
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir + '/' + this.config.REPOFolder;
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log(dir, dirTo);
        fs.moveSync(dir, dirTo);
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        fs.removeSync(dirR);
        console.log('removed', dirR);
        console.log();
        fs.writeJsonSync(dirTo + '/branch.json', { branch: branch, syncedOn: Base_1.Ver.date() });
        console.log('DONE!');
        console.log('Maybe time to make/bake', dirTo);
        console.log('and then point http server to', dirTo);
        console.log();
        process.exit();
    }
    _emptyFolders() {
        let dirR = this.config.PROJECT;
        dirR = this.dir + '/' + dirR;
        console.log('remove', dirR);
        fs.removeSync(dirR);
        let dirTo = this.config.PROJECT;
        dirTo = this.dir + '/' + this.config.LOCALFolder;
        console.log('remove', dirTo);
        fs.removeSync(dirTo);
    }
    async _getNEWRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['remote', 'add', branch, this.remote], { cwd: dir });
        const { stdout3 } = await execa('git', ['checkout', '-b', branch], { cwd: dir });
        const { stdout4 } = await execa('git', ['push', '-u', 'origin', branch], { cwd: dir });
    }
    async _getEXISTINGRemoteBranch(branch) {
        const { stdout } = await execa('git', ['clone', this.remote]);
        let dir = this.config.PROJECT;
        dir = this.dir + '/' + dir;
        const { stdout2 } = await execa('git', ['checkout', branch], { cwd: dir });
        console.log(dir, branch);
    }
    async _branchExists(branch) {
        let cmd = this.remote;
        cmd += '.git';
        logger.info(cmd);
        const { stdout } = await execa('git', ['ls-remote', cmd]);
        this.exists = stdout.includes(branch);
        logger.trace(stdout);
    }
}
exports.GitDown = GitDown;
class ExportFS {
    constructor(config) {
        this.args = config.split(':');
        this.serviceAccountConfig = this.args[0];
        this.name = this.args[1];
        this.config = require(this.serviceAccountConfig + '.json');
        firebase.initializeApp({
            credential: firebase.credential.cert(this.config),
        });
        this.collectionRef = firebase.firestore();
    }
    export() {
        let _this = this;
        node_firestore_import_export_1.firestoreExport(this.collectionRef)
            .then(data => {
            console.log(data);
            fs.writeJsonSync(_this.name + '.json', data, 'utf8');
        });
    }
}
exports.ExportFS = ExportFS;
class ImportFS {
    constructor(config) {
        this.args = config.split(':');
        this.serviceAccountConfig = this.args[0];
        this.pathToImportedFile = this.args[1];
        this.config = require(this.serviceAccountConfig + '.json');
        firebase.initializeApp({
            credential: firebase.credential.cert(this.config),
        });
        this.collectionRef = firebase.firestore();
    }
    import() {
        let _this = this;
        fs.readJson(this.pathToImportedFile + '.json', function (err, result) {
            node_firestore_import_export_1.firestoreImport(result, _this.collectionRef)
                .then(() => {
                console.log('Data was imported.');
            });
        });
    }
}
exports.ImportFS = ImportFS;
module.exports = {
    FileOps, CSV2Json, GitDown, ExportFS, ImportFS, DownloadFrag, YamlConfig, Download, Static, VersionNag
};
