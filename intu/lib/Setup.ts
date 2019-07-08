
export class Setup {

setup(pathToDb) { 
    const port = '9081' //init port
    adbDB.connectToDb(pathToDb) //connect to db
    const host = [hostIP + port, config.cors]
 
    const mainEApp = new ExpressRPC()
    mainEApp.makeInstance(host);
 
       
 }//()

}