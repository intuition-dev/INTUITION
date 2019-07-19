
import { MetaPro } from 'mbake/lib/Wa';
import { Dat, FileOps } from 'mbake/lib/FileOpsBase';
import fs = require('fs-extra')

export class AppLogic {
    
    async autoBake(appPath, itemPath, fileName) {
        const meta = new MetaPro(appPath)
        const res = await meta.autoBake(itemPath, fileName)
        return res
        //setTimeout(function(){
            // autobake is automatic in CLI, and tested! So if anything fix the args till it works
           // meta.autoBake(itemPath, fileName)
        //},1)
    }//()

    /**
     * 
     * @param appPath 
     * @param itemPath 
     * @param date INT, linuxtime GMT
     */
    async setPublishDate(appPath, itemPath, date:number) {
        const dat = new Dat(appPath+itemPath)
        
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
    async archive(appPath, itemPath, fileName)  {

        const oldPath = appPath  + itemPath
        
        const targetPath = appPath  + itemPath + '/archive/'
        if(!fs.existsSync)
            fs.mkdirSync(targetPath)
        
        const fo = new FileOps(appPath)
        const count = fo.count(fileName)

        await fs.copySync(oldPath+fileName, targetPath+fileName+count)

        const res = fs.pathExists(oldPath+fileName, targetPath+fileName+count) ? 'OK' : 'Err'
        return res
    }//()

}//()