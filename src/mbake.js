#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdmZip = require("adm-zip");
const commandLineArgs = require("command-line-args");
const Base_1 = require("./lib/Base");
const clear = require("cli-clear");
const Sa_1 = require("./lib/Sa");
clear();
const cwd = process.cwd();
function version() {
    let b = new Base_1.Ver();
    console.info('mbake CLI version: ' + b.ver());
}
function help() {
    let b = new Base_1.Ver();
    console.info();
    console.info('mbake CLI version: ' + b.ver());
    console.info();
    console.info('Usage:');
    console.info('  To process any_dir Pug to html recursively:                 mbake .');
    console.info('  Process SASS/SCSS file into css, requires assets.yaml:      mbake -s .');
    console.info('     or path that has assets.yaml, or any sub-folder under /assets');
    console.info('  Process .ts and .js file to .min:                           mbake -t .');
    console.info('  To process Pug and dat_i items to items.json:               mbake -i .');
    console.info('     or any sub-folder, where path is folder containing dat_i.yaml;');
    console.info('     also does regular mbake of Pug');
    console.info('  Download fragment to setup the app FW(framework):           mbake -f .');
    console.info('     Note: . is current directory, or use any path instead of .');
    console.info(' -------------------------------------------------------------');
    console.info();
    console.info(' Starters:');
    console.info('  For a starter website:                                      mbake -w');
    console.info('  For a starter CMS|items:                                    mbake -c');
    console.info('  For an example dynamic web app CRUD:                        mbake -u');
    console.info();
    console.info('  mbakeX CLI (extra) has watcher, components and more flags and examples: mbakeX');
    console.info();
    console.info(' Full docs: https://docs.Metabake.org');
    console.info();
    console.info(' This is the CLI. For WebAdmin version of MetaBake, get from NPM or');
    console.info('   check this https://github.com/metabake/mbakeWebAdmin ');
    console.info();
    process.exit();
}
const optionDefinitions = [
    { name: 'mbake', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'items', alias: 'i', type: Boolean },
    { name: 'css', alias: 's', type: Boolean },
    { name: 'MinJS', alias: 't', type: Boolean },
    { name: 'frag', alias: 'f', type: Boolean },
    { name: 'CMS', alias: 'c', type: Boolean },
    { name: 'website', alias: 'w', type: Boolean },
    { name: 'CRUD', alias: 'u', type: Boolean }
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbake;
console.info();
function unzipCRUD() {
    let src = __dirname + '/CRUD.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an example CRUD to ./CRUD');
    process.exit();
}
function unzipS() {
    let src = __dirname + '/website.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter website to ./website');
    process.exit();
}
function unzipE() {
    let src = __dirname + '/CMS.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter CMS app to ./CMS');
    process.exit();
}
function frag(arg) {
    new Base_1.DownloadFrag(arg, false);
}
if (arg) {
    arg = Base_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        let d = cwd;
        d = Base_1.Dirs.slash(d);
        let n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else if (arg.startsWith('.')) {
        arg = cwd;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
function bake(arg) {
    let pro = new Base_1.MBake().bake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function itemize(arg) {
    let pro = new Base_1.MBake().itemizeNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function css(arg) {
    let pro = new Sa_1.Sas().css(arg);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function minJS(arg) {
    let min = new Sa_1.MinJS();
    let pro = min.ts(arg);
    pro.then(function (val) {
        console.log(val);
        min.min(arg);
    });
}
if (argsParsed.items)
    itemize(arg);
else if (argsParsed.css)
    css(arg);
else if (argsParsed.CMS)
    unzipE();
else if (argsParsed.CRUD)
    unzipCRUD();
else if (argsParsed.website)
    unzipS();
else if (argsParsed.MinJS)
    minJS(arg);
else if (argsParsed.frag)
    frag(arg);
else if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (!arg)
    help();
else
    bake(arg);
