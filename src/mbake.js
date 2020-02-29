#!/usr/bin/env node
"use strict";
// All rights reserved by INTUITION.DEV |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const commandLineArgs = require("command-line-args");
const Base_1 = require("./lib/Base");
const Extra_1 = require("./lib/Extra");
const { Dirs } = require('agentg/lib/FileOpsExtra');
const Wa_1 = require("./lib/Wa");
const { DownloadFrag, VersionNag, DownloadC } = require('agentg/lib/FileOpsExtra');
VersionNag.isCurrent('mbake', Base_1.Ver.ver()).then(function (isCurrent_) {
    try {
        if (!isCurrent_)
            console.log('There is a newer version of mbake CLI, please update.');
    }
    catch (err) {
        console.log(err);
    }
}); // 
// imports done /////////////////////////////////////////////
const cwd = process.cwd();
function version() {
    console.info('mbake CLI version: ' + Base_1.Ver.ver());
}
function help() {
    console.info();
    console.info('mbake CLI version: ' + Base_1.Ver.ver());
    console.info();
    console.info('Usage:');
    console.info('  To process any_dir Pug to html recursively:                 mbake .');
    console.info('  For local watcher and server:                               mbake -w .');
    console.info('  Process SASS/SCSS file into css, requires style.yaml:       mbake -s .');
    console.info('     or path that has style.yaml, or any sub-folder under /style');
    console.info('  Process .ts, .js or native Custom Elements(-custel) :       mbake -t .');
    console.info('  To process Pug and dat_i items to items.json:               mbake -i .');
    console.info('     or any sub-folder, where path is folder containing dat_i.yaml;');
    console.info('     also does regular mbake of Pug');
    console.info('  Download fragment to setup the app FW(framework):           mbake -f .');
    console.info();
    console.info('  Download Intro to Pug example:                              mbake --pug ');
    console.info('     Note: . is current directory; or use any path instead of .');
    console.info(' -------------------------------------------------------------');
    console.info();
    console.info('  mbakex CLI (extra) has more flags');
    console.info();
    console.info(' Full docs: http://www.INTUITION.DEV');
    console.info();
}
// args: //////////////////////////////////////////////////////////////////////////////////////////////////////
const optionDefinitions = [
    { name: 'mbake', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'items', alias: 'i', type: Boolean },
    { name: 'css', alias: 's', type: Boolean },
    { name: 'MinJS', alias: 't', type: Boolean },
    { name: 'frag', alias: 'f', type: Boolean },
    { name: 'watcher', alias: 'w', type: Boolean },
    { name: 'pug', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbake;
console.info();
function frag(arg) {
    new DownloadFrag(arg);
}
// get folder to be processed: ///////////////////////////////////////////////////////////////////////////////////////////////////////
if (arg) {
    arg = Dirs.slash(arg);
    if (arg.startsWith('/')) {
        //do nothing, full path is arg
    }
    else if (arg.startsWith('..')) { // few  cases to test
        arg = arg.substring(2);
        let d = cwd;
        d = Dirs.slash(d);
        // find offset
        let n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else if (arg.startsWith('.')) { //cur
        arg = cwd;
    }
    else { // just plain, dir passed
        arg = cwd + '/' + arg;
    } // inner
} //outer
//  ////////////////////////////////////////////////////////////////////////////////////////////////
function pugIntro() {
    new DownloadC('pugInto', __dirname).autoUZ();
    console.info('Extracted Intro to Pug example');
} //()
function bake(arg) {
    let pro = new Base_1.MBake().bake(arg, 0);
    pro.then(function (val) {
        console.log(val);
    });
}
function itemize(arg) {
    let pro = new Base_1.MBake().itemizeNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
    });
}
function css(arg) {
    let pro = new Extra_1.Sas().css(arg);
    pro.then(function (val) {
        console.log(val);
    });
}
function minJS(arg) {
    let min = new Extra_1.MinJS();
    let pro = min.ts(arg);
    pro.then(function (val) {
        console.log(val);
        min.min(arg);
    });
}
// start: /////////////////////////////////////////////////////////////////////////////////////
if (argsParsed.items)
    itemize(arg);
else if (argsParsed.css)
    css(arg);
else if (argsParsed.MinJS)
    minJS(arg);
else if (argsParsed.frag)
    frag(arg);
else if (argsParsed.pug)
    pugIntro();
else if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (argsParsed.watcher)
    Wa_1.Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
else if (!arg)
    help();
else
    bake(arg);
