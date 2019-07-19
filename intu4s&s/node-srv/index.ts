
import { IntuApp } from 'intu/node-srv/IntuSrv';
import { ADB } from 'intu/node-srv/lib/ADB';

const adbDB = new ADB()
let app = new IntuApp(adbDB, ['*'])
// app starts ////////////////////////////////////
