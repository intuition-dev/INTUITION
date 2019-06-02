#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdmZip = require("adm-zip");
const commandLineArgs = require("command-line-args");
const Base_1 = require("./lib/Base");
const Wa_1 = require("./lib/Wa");
const Spider_1 = require("./lib/Spider");
const Extra_1 = require("./lib/Extra");
const FileOpsBase_1 = require("./lib/FileOpsBase");
const FileOpsExtra_1 = require("./lib/FileOpsExtra");
const cwd = process.cwd();
function version() {
    console.info('mbakeX CLI version: ' + Base_1.Ver.ver());
}
function help() {
    let b = new Base_1.Ver();
    console.info();
    console.info('mbakeX CLI version: ' + Base_1.Ver.ver());
    console.info('  your node version is ' + process.version);
    console.info('  from ' + __dirname);
    console.info();
    console.info('Usage: ');
    console.info('  For local(non-cloud) watcher and server on port:            mbakeX -w .');
    console.info('     (default 8090, default reload 9856)');
    console.info('    -p, --port to specify port for watcher:                   mbakeX -w . -p 8091 -r 9857');
    console.info('     (must be used with -r)');
    console.info('    -r, --reload-port to specify port for live reload :       mbakeX -w . --port=8091 --reload-port=9857');
    console.info();
    console.info('  To process Pug and RIOT *-comp.pug components:              mbakeX -c .');
    console.info('    -c also does regular mbake of Pug, not just comps.');
    console.info('  To bake with dev. ENV flag(1) in prod(default is 0):        mbakeX --bakeD .');
    console.info('  To bake with staging ENV flag(2) in prod:                   mbakeX --bakeS .');
    console.info('  To bake with production ENV flag(3) in prod:                mbakeX --bakeP .');
    console.info();
    console.info('  Download fragment to setup the app devOps:                  mbake --ops .');
    console.info('  To map map.yaml to menu.json, sitemap.xml and FTS.idx:      mbakeX -m .');
    console.info('  Compress 3200 or larger .jpg images to 2 sizes:             mbakeX -i .');
    console.info('  To process list.csv to list.json:                           mbakeX -l .');
    console.info('  To download branch from git, in folder with gitdown.yaml:   mbakeX --gitDown GIT-PSWD');
    console.info('     passing the git password of gitdown user');
    console.info('  To recursively remove source files:                         mbakeX --prod .');
    console.info('  To export FiresStore data, it needs two arguments separated ');
    console.info('   with ":" :                                                 mbakeX --exportFS serviceAccountKey:name_of_the_file');
    console.info('  To import FireStore data, it needs two arguments separated  ');
    console.info('  with ":":                                                   mbakeX --importFS serviceAccountKey:name_of_the_json_exported_file');
    console.info();
    console.info('    Note: . is current directory, or use any path instead of .');
    console.info(' -------------------------------------------------------------');
    console.info();
    console.info(' Starters:');
    console.info('  For a starter dash web-app:                                 mbakeX -d');
    console.info('  For example slides markdown:                                mbakeX -k');
    console.info('  For a Electron(pre-PhoneGap) app:                           mbakeX -e');
    console.info('  For a starter hybrid Phonegap app:                          mbakeX -o');
    console.info('  For an example Ad:                                          mbakeX -a');
    console.info();
    process.exit();
}
const optionDefinitions = [
    { name: 'mbakeX', defaultOption: true },
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'version', alias: 'v', type: Boolean },
    { name: 'watcher', alias: 'w', type: Boolean },
    { name: 'port', alias: 'p', type: String },
    { name: 'reload-port', alias: 'r', type: String },
    { name: 'prod', type: Boolean },
    { name: 'comps', alias: 'c', type: Boolean },
    { name: 'bakeP', type: Boolean },
    { name: 'bakeS', type: Boolean },
    { name: 'bakeD', type: Boolean },
    { name: 'ops', type: Boolean },
    { name: 'gitDown', type: Boolean },
    { name: 'exportFS', type: Boolean },
    { name: 'importFS', type: Boolean },
    { name: 'map', alias: 'm', type: Boolean },
    { name: 'img', alias: 'i', type: Boolean },
    { name: 'csv2Json', alias: 'l', type: Boolean },
    { name: 'dash', alias: 'd', type: Boolean },
    { name: 'slides', alias: 'k', type: Boolean },
    { name: 'elect', alias: 'e', type: Boolean },
    { name: 'phonegap', alias: 'o', type: Boolean },
    { name: 'ad', alias: 'a', type: Boolean },
];
const argsParsed = commandLineArgs(optionDefinitions);
let arg = argsParsed.mbakeX;
console.info();
function git(arg) {
    let gg = new FileOpsExtra_1.GitDown(arg);
    gg.process();
}
function exportFS(arg) {
    let ef = new FileOpsExtra_1.ExportFS(arg);
    ef.export();
}
function importFS(arg) {
    let ef = new FileOpsExtra_1.ImportFS(arg);
    ef.import();
}
function frag(arg) {
    new FileOpsExtra_1.DownloadFrag(arg, true);
}
function unzipG() {
    let src = __dirname + '/PGap.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter Phonegap app to ./PG');
    process.exit();
}
function unzipE() {
    let src = __dirname + '/elect.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted a starter Electron app to ./elect');
    process.exit();
}
function unzipD() {
    let src = __dirname + '/ad.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an example ad  ./ad');
    process.exit();
}
function unzipL() {
    let src = __dirname + '/slidesEx.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted example of markdown slides to ./slidesEx');
    process.exit();
}
function unzipH() {
    let src = __dirname + '/dash.zip';
    let zip = new AdmZip(src);
    zip.extractAllTo(cwd, true);
    console.info('Extracted an starter Dash web app to ./dash');
    process.exit();
}
function csv2Json(arg) {
    new FileOpsExtra_1.CSV2Json(arg).convert();
}
function map(arg) {
    new Spider_1.Map(arg).gen();
}
function img(arg) {
    new Extra_1.Resize().do(arg);
}
function comps(arg) {
    let pro = new Base_1.MBake().compsNBake(arg, 0);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function prod(arg) {
    new Base_1.MBake().clearToProd(arg);
    process.exit();
}
function bakeP(arg) {
    let pro = new Base_1.MBake().bake(arg, 3);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function bakeS(arg) {
    let pro = new Base_1.MBake().bake(arg, 2);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
function bakeD(arg) {
    let pro = new Base_1.MBake().bake(arg, 1);
    pro.then(function (val) {
        console.log(val);
        process.exit();
    });
}
if (arg) {
    arg = FileOpsBase_1.Dirs.slash(arg);
    if (arg.startsWith('/')) {
    }
    else if (arg.startsWith('..')) {
        arg = arg.substring(2);
        let d = cwd;
        d = FileOpsBase_1.Dirs.slash(d);
        let n = d.lastIndexOf('/');
        d = d.substring(0, n);
        arg = d + arg;
    }
    else {
        arg = cwd + '/' + arg;
    }
}
if (argsParsed.comps) {
    try {
        comps(arg);
    }
    catch (err) {
        console.info(err);
    }
}
else if (argsParsed.elect)
    unzipE();
else if (argsParsed.phonegap)
    unzipG();
else if (argsParsed.ad)
    unzipD();
else if (argsParsed.csv2Json)
    csv2Json(arg);
else if (argsParsed.watcher) {
    Wa_1.Wa.watch(arg, argsParsed.port, argsParsed['reload-port']);
}
else if (argsParsed.img) {
    img(arg);
}
else if (argsParsed.dash)
    unzipH();
else if (argsParsed.map)
    map(arg);
else if (argsParsed.slides)
    unzipL();
else if (argsParsed.prod)
    prod(arg);
else if (argsParsed.bakeP)
    bakeP(arg);
else if (argsParsed.bakeS)
    bakeS(arg);
else if (argsParsed.bakeD)
    bakeD(arg);
else if (argsParsed.ops)
    frag(arg);
else if (argsParsed.gitDown)
    git(arg);
else if (argsParsed.exportFS)
    exportFS(arg);
else if (argsParsed.importFS)
    importFS(arg);
else if (argsParsed.version)
    version();
else if (argsParsed.help)
    help();
else if (!arg)
    help();
