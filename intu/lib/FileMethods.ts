import { Dat, FileOps, Dirs } from 'mbake/lib/FileOpsBase';
const fs = require('fs-extra');
const resp: any = {};

export class FileMethods {
    // move to mbCLI

    // get list of directories
    getDirs(mountPath:string) {

        let dirs = new Dirs(mountPath);
        let dirsToIgnore = ['.', '..'];
        return dirs.getShort()
            .map(el => el.replace(/^\/+/g, ''))
            .filter(el => !dirsToIgnore.includes(el));

    }

    // get files in directory
    getFiles(mountPath:string, post_id:string) { 

        let dirs = new Dirs(mountPath);
        resp.result = dirs.getInDir(post_id);
        
        if (post_id === '/') { // if root directory, remove all dirs from output, leave only files:
            return resp.result.filter(file => file.indexOf('/') === -1 && !fs.lstatSync(mountPath + '/' + file).isDirectory());
        } else {
            return resp.result;
        }

    }
}

module.exports = {
    FileMethods
}