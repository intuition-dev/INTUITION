#!/usr/bin/env node
// License} LGPL 2.1  (c) Metabake.net | Cekvenich

import AdmZip = require('adm-zip')
import commandLineArgs = require('command-line-args')

import { Ver,  Dirs} from './lib/Base'
import clear = require("cli-clear")
import { Wa } from './lib/Wa'

clear()


import { Slides } from './lib/Wa'
new Slides().foo()
process.exit()


// imports done /////////////////////////////////////////////
const cwd:string = process.cwd()

function version() {
   let b = new Ver()
   console.log()
   console.log('mbakeW CLI version: '+b.ver()) // tsc
   console.log('  your node version is '+ process.version)
   console.log('  from '+ __dirname)
   console.log()
   console.log('Usage: ')
   console.log('  For local(non-cloud) GUI watcher: mbakeW -g')

   console.log()
   console.log(' ----------------------------------------------------------------')
   console.log(' Code examples:')

   console.log('  For a Electron(pre-PhoneGap) app: mbake -e')
   console.log('  For a starter hybrid Phonegap app: mbake -p')

   console.log(' Full docs: https://www.Metabake.net' )
   console.log()

   process.exit()
}

// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
   { name: 'mbake', defaultOption: true},

   { name: 'phonegap',  alias: 'p', type: Boolean },
   { name: 'elect',  alias: 'e', type: Boolean },

   { name: 'gwatcher', alias: 'g', type: Boolean }

]
const argsParsed = commandLineArgs(optionDefinitions)
let arg:string = argsParsed.mbake

console.log()

// unzip: ////////////////////////////////////////////////////////////////////////////////////////////
function unzipG() {
   let src:string =__dirname+ '/PGap.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter Phonegap app to ./PG')
   process.exit()
}
function unzipE() {
   let src:string =__dirname+ '/elect.zip'
   let zip = new AdmZip(src)
   zip.extractAllTo(cwd , /*overwrite*/true)
   console.log('Extracted a starter Electron app to ./elect')
   process.exit()
}


// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if(arg) {
   arg = Dirs.slash(arg)
   if(arg.startsWith('/'))  {
      //do nothing, full path is arg
   } else if (arg.startsWith('..')) { // few  cases to test
      arg = arg.substring(2)
      let d = cwd
      d = Dirs.slash(d)
      // find offset
      let n = d.lastIndexOf('/')
      d = d.substring(0,n)
      arg = d + arg
   } else if (arg.startsWith('.')) {//cur

      arg = cwd //test ./dd

   } else  { // just plain, dir passed
      arg = cwd + '/' + arg
   }
}

// start: /////////////////////////////////////////////////////////////////////////////////////
if(argsParsed.elect)
   unzipE()
else if(argsParsed.phonegap)
   unzipG()
else if(argsParsed.gwatcher) {
   Wa.gwatch()
}
else if(!arg)
   version()
