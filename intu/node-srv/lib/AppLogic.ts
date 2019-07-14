
import { MetaPro } from 'mbake/lib/Wa';
import { Dat, FileOps } from 'mbake/lib/FileOpsBase';
import fs = require('fs-extra')

export class AppLogic {
    
    autoBake(appPath, itemPath, fileName) {
        const meta = new MetaPro(appPath)
        setTimeout(function(){
            // autobake is automatic in CLI, and tested! So if anything fix the args till it works
            meta.autoBake(itemPath, fileName)
        },1)
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
        this.autoBake(appPath, itemPath, 'dat.yaml')
    }//()

    async clone(appPath, item, newItem) {
        const fo = new FileOps(appPath)
        await fo.clone(item, newItem)
    }

    /**
    Silently archive a file to archive directory in the folder 
     */
    archive(appPath, itemPath, fileName)  {

        const oldPath = appPath  + itemPath
        
        const targetPath = appPath  + itemPath + '/archive'
        if(!fs.existsSync)
            fs.mkdirSync(targetPath)
        
        const fo = new FileOps(appPath)
        const count = fo.count(fileName)

        fs.copySync(oldPath+fileName, targetPath+fileName+count)
    }//()

}//()