console.log('oh hi')

const ipcBro = require('electron').ipcRenderer
console.log(ipcBro.sendSync('broMsgS', 'S')) // prints "pong"

ipcBro.on('mainMsg1', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcBro.send('broMsgA', 'A')