"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const yaml = require("js-yaml");
const findUp = require("find-up");
const sass = require("node-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const stripCssComments = require("strip-css-comments");
const path = require("path");
const fs = require("fs-extra");
const FileHound = require("filehound");
const sharp = require('sharp');
const ts = require("typescript");
const UglifyJS = require("uglify-es");
const decomment = require("decomment");
const Client = require("ssh2-sftp-client");
const logger = require('tracer').console();
class SFTP {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn + '.yaml'));
        const dir = cfg.from;
        this.sftp = new Client();
        const THIZ = this;
        this.sftp.connect({
            host: cfg.host,
            port: cfg.port,
            username: cfg.username,
            password: cfg.password
        }).then(function (resp) {
            delete cfg.password;
            console.log(cfg);
            THIZ.upload(dir, cfg.hostFolder);
        }).catch(function (err) {
            console.log(cfg);
            console.log(err, 'catch error');
            process.exit(-1);
        });
    }
    async upload(dir, target) {
        const dirs = FileHound.create()
            .paths(dir)
            .directory()
            .findSync();
        const len = dir.length;
        let dirs2 = [];
        for (let s of dirs) {
            let n = s.substring(len);
            dirs2.push(n);
        }
        console.log(dirs2);
        const rec = FileHound.create()
            .paths(dir)
            .addFilter(function (fn) {
            if (fn._pathname.endsWith('.min.js'))
                return true;
            if (fn._pathname.endsWith('.js'))
                return false;
            if (fn._pathname.endsWith('.pug'))
                return false;
            if (fn._pathname.endsWith('.yaml'))
                return false;
            if (fn._pathname.endsWith('.md'))
                return false;
            if (fn._pathname.toLowerCase().endsWith('.scss'))
                return false;
            if (fn._pathname.toLowerCase().endsWith('.sass'))
                return false;
            if (fn._pathname.endsWith('.ts'))
                return false;
            if (fn._pathname.endsWith('tsconfig.json'))
                return false;
            if (fn._pathname.endsWith('.gitignore'))
                return false;
            return true;
        })
            .findSync();
        let rec2 = [];
        for (let s of rec) {
            let n = s.substring(len);
            rec2.push(n);
        }
        console.log(rec2);
        const THIZ = this;
        for (let s of dirs2) {
            await this.mkdirOne(target, s);
        }
        for (let s of rec2) {
            await this.putOne(dir + s, target + s);
        }
        this.done(target);
    }
    async putOne(fn, tn) {
        return this.sftp.fastPut(fn, tn)
            .then(function (resp) {
            console.log(resp);
        }).catch(function (err) {
            console.log(err, 'catch error');
            process.exit(-1);
        });
    }
    async mkdirOne(target, newDir) {
        console.log(target + newDir);
        const THIZ = this;
        return new Promise(function (resolve, reject) {
            THIZ.sftp.mkdir(target + newDir, true)
                .then(function (resp) {
                resolve();
            }).catch(function (err) {
                resolve();
            });
        });
    }
    done(target) {
        const THIZ = this;
        this.sftp.list(target)
            .then(function (resp) {
            for (let obj of resp) {
                console.log(obj.type, obj.name);
            }
            console.log('Done.');
            THIZ.sftp.end();
        }).catch(function (err) {
            console.log(err, 'catch error');
            process.exit(-1);
        });
    }
}
exports.SFTP = SFTP;
class MinJS {
    constructor(dir) {
        try {
            this.ts(dir);
        }
        catch (err) {
            logger.warn(err);
        }
        this.min(dir);
    }
    ts(dir) {
        const rec = FileHound.create()
            .paths(dir)
            .ext("ts")
            .findSync();
        if (rec.length < 1)
            return;
        this.compile(rec, {
            target: ts.ScriptTarget.ES5,
            removeComments: true
        });
    }
    min(dir) {
        const rec = FileHound.create()
            .paths(dir)
            .ext("js")
            .addFilter(function (fn) {
            if (fn._pathname.endsWith('.min.js')) {
                return false;
            }
            if (fn._pathname.endsWith('-comp.js')) {
                return false;
            }
            return true;
        })
            .findSync();
        for (let fn of rec) {
            try {
                this._minOne(fn);
            }
            catch (err) {
                logger.warn(err);
            }
        }
        console.info('Done!'.green);
    }
    _minOne(fn) {
        console.log(fn);
        const code = fs.readFileSync(fn).toString('utf8');
        let result = UglifyJS.minify(code, MinJS.options);
        let txt = decomment(result.code, { space: true });
        txt = txt.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
        txt = txt.replace(/\n\s*\n/g, '\n');
        txt = txt.trim();
        txt = MinJS.ver + txt;
        let fn2 = fn.slice(0, -3);
        fn2 = fn2 + '.min.js';
        fs.writeFileSync(fn2, txt);
    }
    compile(fileNames, options) {
        let program = ts.createProgram(fileNames, options);
        let emitResult = program.emit();
        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        allDiagnostics.forEach(diagnostic => {
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                console.info(`${diagnostic.file.fileName}:`.cyan, `${line + 1}:${character + 1}`.yellow, `${message}`);
            }
            else {
                console.info(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
            }
        });
        let exitCode = emitResult.emitSkipped ? 1 : 0;
        console.info(`status code '${exitCode}'.`);
    }
}
MinJS.ver = '// ' + new Base_1.Ver().ver() + ' on ' + new Date().toISOString() + '\r\n';
MinJS.options = {
    ecma: 5,
    keep_classnames: true,
    parse: { html5_comments: false },
    compress: {
        drop_console: true,
        ecma: 5,
        keep_classnames: true,
        keep_fnames: true,
        reduce_funcs: false
    },
    mangle: false,
    output: {
        beautify: true,
        bracketize: true,
        ecma: 5,
        indent_level: 1,
        preserve_line: true,
        quote_style: 3,
        semicolons: false
    }
};
exports.MinJS = MinJS;
class YamlConfig {
    constructor(fn) {
        let cfg = yaml.load(fs.readFileSync(fn));
        console.info(cfg);
        return cfg;
    }
}
exports.YamlConfig = YamlConfig;
class Resize {
    do(dir) {
        console.info(dir);
        const rec = FileHound.create()
            .paths(dir)
            .ext("jpg")
            .findSync();
        let ret = [];
        for (let s of rec) {
            let n = s.slice(0, -4);
            if (n.includes('.min'))
                continue;
            ret.push(n);
        }
        console.info(ret);
        for (let s of ret) {
            this.smaller(s);
        }
    }
    smaller(file) {
        sharp(file + '.jpg')
            .resize(1680 * 1.9)
            .jpeg({
            quality: 74,
            progressive: true,
            trellisQuantisation: true
        })
            .blur()
            .toFile(file + '.2K.min.jpg');
        sharp(file + '.jpg')
            .resize(320 * 2)
            .jpeg({
            quality: 78,
            progressive: true,
            trellisQuantisation: true
        })
            .toFile(file + '.32.min.jpg');
    }
}
exports.Resize = Resize;
class Sas {
    css(dir) {
        logger.info(dir);
        let m;
        let fn = dir + '/assets.yaml';
        if (fs.existsSync(fn))
            m = yaml.load(fs.readFileSync(fn));
        else {
            let dir2 = findUp.sync('assets.yaml', { cwd: dir });
            m = yaml.load(fs.readFileSync(dir2));
            dir = dir2.slice(0, -12);
        }
        logger.info(dir);
        const css = m.css;
        const set = new Set(css);
        logger.info(set);
        for (let item of set) {
            this._trans(item, dir);
        }
        console.info();
        console.info(' Done!'.green);
    }
    _trans(fn2, dir) {
        let css = sass.renderSync({
            file: dir + '/' + fn2,
            outputStyle: 'compact'
        });
        postcss([autoprefixer({ browsers: ['> 1%', 'ios_saf >= 8', 'not ie < 11'] })]).process(css.css, { from: undefined }).then(function (result) {
            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });
            let res = stripCssComments(result.css, { preserve: false });
            res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
            res = res.replace(/\n\s*\n/g, '\n');
            res = res.trim();
            res = res.replace(/  /g, ' ');
            res = res.replace(/; /g, ';');
            res = res.replace(/: /g, ':');
            res = res.replace(/ }/g, '}');
            res = res.replace(/ { /g, '{');
            res = res.replace(/, /g, ',');
            const ver = ' /* mB ' + new Base_1.Ver().ver() + ' on ' + new Date().toISOString() + " */";
            res = res + ver;
            let filename2 = path.basename(fn2);
            filename2 = filename2.split('.').slice(0, -1).join('.');
            let filename = filename2.split('\\').pop().split('/').pop();
            fs.ensureDirSync(dir + '/css');
            fs.writeFileSync(dir + '/css/' + filename + '.css', res);
        });
    }
}
exports.Sas = Sas;
module.exports = {
    Sas, Resize, YamlConfig, SFTP, MinJS
};
