"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Wa_1 = require("mbake/lib/Wa");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const fs = require("fs-extra");
class Util {
    static get appPath() {
        let appPath = require('require-main-filename')();
        let i = appPath.lastIndexOf('/');
        i = appPath.lastIndexOf('/');
        appPath = appPath.substr(0, i);
        i = appPath.lastIndexOf('/');
        appPath = appPath.substr(0, i);
        return appPath;
    } //()
} //class
exports.Util = Util;
class BusLogic {
    static veri() {
        return 'v8.2.4';
    }
    async autoBake(appPath, itemPath, fileName) {
        const meta = new Wa_1.MetaPro(appPath);
        return await meta.autoBake(itemPath, fileName);
    } //()
    /**
     *
     * @param appPath
     * @param itemPath
     * @param date INT, linuxtime GMT
     */
    async setPublishDate(appPath, itemPath, date) {
        const dat = new FileOpsBase_1.Dat(appPath + itemPath);
        dat.set('publishDate', date);
        await dat.write();
        // update items json or such as needed
        const res = await this.autoBake(appPath, itemPath, 'dat.yaml');
        return res;
    } //()
    async clone(appPath, item, newItem) {
        const fo = new FileOpsBase_1.FileOps(appPath);
        const res = await fo.clone(item, newItem);
        return res;
    }
    /**
    Silently archive a file to archive directory in the folder
     */
    async archive(appPath, itemPath, fileName) {
        const oldPath = appPath + itemPath;
        const targetPath = appPath + itemPath + '/archive/';
        if (!fs.existsSync)
            fs.mkdirSync(targetPath);
        const fo = new FileOpsBase_1.FileOps(appPath);
        const count = fo.count(fileName);
        await fs.copySync(oldPath + fileName, targetPath + fileName + count);
        return await fs.pathExists(oldPath + fileName, targetPath + fileName + count) ? 'OK' : 'Err';
    } //()
} //()
exports.BusLogic = BusLogic;
