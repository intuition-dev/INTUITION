"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const sass = require("node-sass");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const stripCssComments = require("strip-css-comments");
const path = require("path");
const fs = require("fs");
class Sas {
    trans(fn) {
        console.log(fn);
        let css = sass.renderSync({
            file: fn,
            outputStyle: 'compact'
        });
        let filename = path.basename(fn);
        filename = filename.split('.').slice(0, -1).join('.');
        postcss([autoprefixer({ browsers: ['> 1%', 'not ie < 11'] })]).process(css.css, { from: undefined }).then(function (result) {
            result.warnings().forEach(function (warn) {
                console.warn(warn.toString());
            });
            let res = stripCssComments(result.css, { preserve: false });
            res = res.replace(/(\r\n\t|\n|\r\t)/gm, '\n');
            res = res.replace(/\n\s*\n/g, '\n');
            res = res.trim();
            const ver = ' /* mB ' + new Base_1.Ver().ver() + ' on ' + new Date().toISOString() + " */";
            res = res + ver;
            fs.writeFileSync(filename + '.css', res);
        });
    }
}
exports.Sas = Sas;
module.exports = {
    Sas
};
