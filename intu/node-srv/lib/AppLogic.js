"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Wa_1 = require("mbake/lib/Wa");
const FileOpsBase_1 = require("mbake/lib/FileOpsBase");
const fs = require("fs-extra");
class AppLogic {
    autoBake(appPath, itemPath, fileName) {
        const meta = new Wa_1.MetaPro(appPath);
        setTimeout(function () {
            meta.autoBake(itemPath, fileName);
        }, 1);
    }
    async setPublishDate(appPath, itemPath, date) {
        const dat = new FileOpsBase_1.Dat(appPath + itemPath);
        dat.set('publishDate', date);
        await dat.write();
        this.autoBake(appPath, itemPath, 'dat.yaml');
    }
    async clone(appPath, item, newItem) {
        const fo = new FileOpsBase_1.FileOps(appPath);
        await fo.clone(item, newItem);
    }
    archive(appPath, itemPath, fileName) {
        const oldPath = appPath + itemPath;
        const targetPath = appPath + itemPath + '/archive';
        if (!fs.existsSync)
            fs.mkdirSync(targetPath);
        const fo = new FileOpsBase_1.FileOps(appPath);
        const count = fo.count(fileName);
        fs.copySync(oldPath + fileName, targetPath + fileName + count);
    }
}
exports.AppLogic = AppLogic;
