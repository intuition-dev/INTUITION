
class Model2 {

   getViewObject(name) {
      if(name=='form2') {
         return {
            name: 'view',
            lastName: 'cekvenich'
         }
      }
   }

read(cb, name) {
   cb(this.getViewObject('form2'))
}
}