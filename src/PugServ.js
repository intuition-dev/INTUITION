"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pug = require("pug");
let source = `
header
body
   p Hello #{key1}
`;
let options = { key1: 'World' };
let html = pug.renderFile(source, options);
