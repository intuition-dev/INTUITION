
import { IntuApp } from 'intu/node-srv/IntuSrv'
import { SDB } from './lib/SDB'
import { SnipHook } from './lib/SnipHook';

const db = new SDB()
const app = new IntuApp(db, ['*'])
// app starts ////////////////////////////////////

// single port:
const snipHook = new SnipHook(db) 
app.appInst.post('/api/snipHook/', snipHook.handleWebHook)
