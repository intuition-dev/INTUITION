
import { CDB } from '../lib/CDB'
const bunyan = require('bunyan')
const bformat = require('bunyan-format2')  
const formatOut = bformat({ outputMode: 'short' })
const log = bunyan.createLogger({src: true, stream: formatOut, name: "some name"})
import { BaseRPCMethodHandler, iAuth } from 'mbake/lib/Serv'

export class CrudPgHandler extends BaseRPCMethodHandler {

   cdb

   constructor(cdb) {
      super()
      this.cdb = cdb
   }

   async selectAll(resp, params, user, pswd) {
      let data = await this.cdb.selectAll()
      this.ret(resp, data, null, null)
   }//()

   async selectOne(resp, params, user, pswd) {
      let id = params.id
      let data = await this.cdb.selectGUID(id)
      this.ret(resp, data, null, null)
   }//()

   async insert(resp, params, user, pswd) {
      let guid = params.guid
      let name= params.name
      let topics= params.topics

      let data = await this.cdb. insert(guid, name, topics)
      this.ret(resp, data, null, null)
   }//()

}//class

module.exports = {
   CrudPgHandler
}