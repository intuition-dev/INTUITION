
import { MetaPro } from 'mbake/lib/Wa';

export class AppLogic {
    
    autoBake(appPath, itemPath, fileName) {
        const meta = new MetaPro(appPath)
        setTimeout(function(){
            // autobake is automatic in CLI, and tested! So if anything fix the args till it works
            meta.autoBake(itemPath, fileName)
        },1)
    }//()

    clone(appPath, item, newItem) {

    }

    /**
    Silently archive a file to archive directory in the folder 
     */
    archive(appPath, itemPath, fileName)  {

    /*
            // add /archive
      let checkDat = dirCont.getInDir('/' + pathPrefix)
      if (checkDat.length > 0) {
         const archivePath = '/' + pathPrefix + '/archive';
         if (!fs.existsSync(this.mountPath + archivePath)) {
            fs.mkdirSync(this.mountPath + archivePath);
         }

         let archiveFileOps = new FileOps(this.mountPath + archivePath);

         let extension = path.extname(post_id);
         let fileName = path.basename(post_id, extension);
         let count = archiveFileOps.count(path.basename(post_id));
         let archiveFileName = '/' + fileName + extension + '.' + count;
         archiveFileOps.write(archiveFileName, content);
      }

            
      */
    }//()

}//()