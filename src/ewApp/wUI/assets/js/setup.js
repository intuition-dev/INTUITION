
// All rights Metabake.net | Cekvenich, licensed under LGPL 2.1

/*
const ipcBro = require('electron').ipcRenderer
console.log(ipcBro.sendSync('broMsgS', 'S')) // prints "pong"

ipcBro.on('mainMsg1', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcBro.send('broMsgA', 'A')
*/

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
myConsole.log('hello console from bro')