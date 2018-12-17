// All rights Metabake.net | Cekvenich, licensed under LGPL 2.1

const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron')

const electron = require('electron')
const dialog = electron.dialog

const path = require('path')
// Main /////////////////////////////////////////////////////////////////////

//const bp = require("global-modules-path").getPath("mbake")
//let appDir = path.dirname(require.main.filename)

console.log('proc:')
let appDir = process.argv[2]
//appDir = appDir.substring(0, appDir.lastIndexOf('/'))
console.log(appDir)

const fp = appDir+  "/ewApp/wUI/index.html"
const { Ver, MBake } =  require(appDir+'/lib/Base.js')
const {  Watch, MetaPro, MDevSrv } =  require(appDir+'/lib/Wa.js')

console.log(new Ver().ver())

let renWindow
function createWindow () {
   renWindow = new BrowserWindow({width: 400, height: 200})
   renWindow.setMenu(null)
   renWindow.setTitle('Metabake Watch')

   renWindow.loadFile(fp)

   //renWindow.webContents.openDevTools()
   renWindow.on('closed', function () {
      renWindow = null
   })
}

app.on('ready', createWindow)
app.on('activate', function () {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (renWindow === null) {
      createWindow()
   }
})

app.on('window-all-closed', function () {
   // On OS X it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   //if (process.platform !== 'darwin') {
      app.quit()
   //}
})


/* IPC
ipcMain.on('broMsgS', (event, arg) => {
   console.log(arg) // prints "ping"
   event.returnValue = 'SS'
})
ipcMain.on('broMsgA', (event, arg) => {
   console.log(arg) // prints "ping"
   event.sender.send('mainMsg1', 'AA')
})
*/


const mbake = new MBake()

exports.selectDirectory = function () {
  dialog.showOpenDialog(renWindow, {properties:['openDirectory']}, function(dn){
   console.log(dn[0])
   monitorDir(dn[0])
  })
}//()

function monitorDir(dir) {
   //mbake.bake(dir)
   let ss = new MDevSrv(dir, 8090)
   
   const mp = new MetaPro(dir)
   let ww = new Watch(mp, dir)
   ww.start(false)
   console.log('watching ... ')
   require('electron').shell.openExternal("http://localhost:8090")
}//()

