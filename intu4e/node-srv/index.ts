
import { Vere } from './lib/intu4e';
import { VersionNag } from 'mbake/lib/FileOpsExtra'
import { ExpressRPC } from 'mbake/lib/Serv';

// import { ShippingRoutes } from '../e-com/api/lib/shipping';

const mainApp = ExpressRPC.makeInstance(null)

 //shipping stuff
 mainApp.get('/api/shipping/:name', function (req, res, next) {
   var shipping = require('./lib/shipping');
   var name = req.params.name;
   console.log("TCL: mainAppsetup -> name", name)
   shipping.init(mainApp, name, null)
   next()
});

getPrintfulAPI() {
   return this.db.all(`SELECT printfulApi FROM configs`, [], function (err, rows) {
      if (err) {
      }
      return rows
   })
}


VersionNag.isCurrent('intu4e', Vere.ver() ).then(function(isCurrent_:boolean){
   try{
   if(!isCurrent_) 
      console.log('There is a newer version of mbake CLI, please update.')
   else
      console.log('You have the current version of mbake CLI')
   } catch(err) {
      console.log(err)
   }
})// 
