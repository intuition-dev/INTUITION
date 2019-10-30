
import { MetaPro } from 'mbake/lib/Wa';
import { Dat, FileOps } from 'mbake/lib/FileOpsBase';
import fs = require('fs-extra')

export class Util {

    static get appPath(): string {
        let appPath: string = require('require-main-filename')()
        let i: number = appPath.lastIndexOf('/')
        i = appPath.lastIndexOf('/')
        appPath = appPath.substr(0, i)
        i = appPath.lastIndexOf('/')
        appPath = appPath.substr(0, i)

        return appPath
    }//()

}//class

export class AppLogic {

    static veri() {
        return 'v1.10.9'
    }
    async autoBake(appPath, itemPath, fileName) {
        const meta = new MetaPro(appPath)
        return await meta.autoBake(itemPath, fileName)
    }//()

    /**
     * 
     * @param appPath 
     * @param itemPath 
     * @param date INT, linuxtime GMT
     */
    async setPublishDate(appPath, itemPath, date: number) {
        const dat = new Dat(appPath + itemPath)

        dat.set('publishDate', date)
        await dat.write()

        // update items json or such as needed
        const res = await this.autoBake(appPath, itemPath, 'dat.yaml')
        return res
    }//()

    async clone(appPath, item, newItem) {
        const fo = new FileOps(appPath)
        const res = await fo.clone(item, newItem)
        return res
    }

    /**
    Silently archive a file to archive directory in the folder 
     */
    async archive(appPath, itemPath, fileName) {

        const oldPath = appPath + itemPath

        const targetPath = appPath + itemPath + '/archive/'
        if (!fs.existsSync)
            fs.mkdirSync(targetPath)

        const fo = new FileOps(appPath)
        const count = fo.count(fileName)

        await fs.copySync(oldPath + fileName, targetPath + fileName + count)

        return await fs.pathExists(oldPath + fileName, targetPath + fileName + count) ? 'OK' : 'Err'
    }//()

}//()