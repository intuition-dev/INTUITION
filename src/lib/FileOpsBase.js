"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const terse_b_1 = require("terse-b/terse-b");
const log = new terse_b_1.TerseB("file ops b");
const fs = require("fs-extra");
const yaml = require("js-yaml");
const FileHound = require("filehound");
const { Dirs } = require('agentg/lib/FileOpsExtra');
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
        return new Promise((resolve, reject) => {
            try {
                let y = yaml.dump(this.props, {
                    skipInvalid: true,
                    noRefs: true,
                    noCompatMode: true,
                    condenseFlow: true
                });
                let p = this._path + '/dat.yaml';
                fs.writeFileSync(p, y);
                resolve('OK');
            }
            catch (err) {
                log.warn(err);
                reject(err);
            }
        }); //()
    }
    set(key, val) {
        this.props[key] = val;
    }
    _addData() {
        let jn = this.props.include;
        let fn = this._path + '/' + jn;
        let jso = fs.readFileSync(fn);
        Object.assign(this.props, JSON.parse(jso.toString())); // merge
    }
    getAll() {
        return this.props;
    } //()
} //class
exports.Dat = Dat;
class FileOps {
    constructor(root_) {
        this.root = Dirs.slash(root_);
    }
    /** returns # of files with the name, used to archive ver */
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
            fs.copySync(this.root + src, this.root + dest);
            let p = this.root + dest;
            const d = new Dat(p);
            d.write();
            log.info('copy!');
            resolve('OK');
        });
    } //()
    write(destFile, txt) {
        log.info(this.root + destFile);
        fs.writeFileSync(this.root + destFile, txt);
    }
    read(file) {
        return fs.readFileSync(this.root + file).toString();
    }
    remove(path) {
        let dir_path = this.root + path;
        log.info('remove:' + dir_path);
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
} //class
exports.FileOps = FileOps;
class FileMethods {
    // get list of directories
    getDirs(mountPath) {
        let dirs = new Dirs(mountPath);
        let dirsToIgnore = ['.', '..'];
        return dirs.getShort()
            .map(el => el.replace(/^\/+/g, '')) //?
            .filter(el => !dirsToIgnore.includes(el));
    }
    // get files in directory
    getFiles(mountPath, item) {
        let dirs = new Dirs(mountPath);
        let result = dirs.getInDir(item);
        if (item === '/') { // if root directory, remove all dirs from output, leave only files:
            return result.filter(file => file.indexOf('/') === -1 && !fs.lstatSync(mountPath + '/' + file).isDirectory());
        }
        else {
            return result;
        }
    }
}
exports.FileMethods = FileMethods;
