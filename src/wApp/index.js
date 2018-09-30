const {app, BrowserWindow} = require('electron')

const path = require('path')
const fp = path.resolve('wApp/eScr/index.html')
console.log(fp)


let mainWindow
function createWindow () {
   mainWindow = new BrowserWindow({width: 800, height: 600})
   mainWindow.setMenu(null)
   mainWindow.setTitle('On hi')

   mainWindow.loadFile(fp)

   //mainWindow.webContents.openDevTools()
   mainWindow.on('closed', function () {
      mainWindow = null
   })
}
app.on('ready', createWindow)
app.on('activate', function () {
   // On OS X it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (mainWindow === null) {
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
