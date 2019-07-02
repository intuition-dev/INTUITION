"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CDB_1 = require("./lib/CDB");
const cdb = new CDB_1.CDB();
cdb.init();
console.log(cdb.selectAll());
