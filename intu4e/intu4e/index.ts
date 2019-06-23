
import { Vere } from './lib/intu4e';
import { VersionNag } from 'mbake/lib/FileOpsExtra'

// import { ShippingRoutes } from '../e-com/api/lib/shipping';


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
