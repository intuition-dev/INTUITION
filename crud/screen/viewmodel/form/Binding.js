
class BindForm {// extends ViewModelDataServ {

   constructor(){
      super()
      this.form = ''
      this.data = typeof localStorage.getItem('row') !='undefined' && JSON.parse(localStorage.getItem('row'));
   }
   
   init(data, divId) {
      this.form = '#'+divId
      if( this.data !=null){
         this._onData()
      }
   }
   
   _onData() {
      const row = this.data
      let _this = this

      depp.require(['pre'], function() { // where is the save mapping, opposite of this?
            $(_this.form).find('input[name="col1"]').val(row['col1'])
            $(_this.form).find('input[name="col2"]').val(row['col2'])
            $(_this.form).find('input[name="id"]').val(row['id'])
      })
   }

   /*
   getFields() {
      let lst = {}
      //start w/ pk
      let input = $(this.form+' [name="id"]')
      lst['id'] = input.val()
   
      $(this.form+' input').each(
         function(index){  
            let input = $(this)
            lst[ input.attr('name')] = input.val()
         }//index
      )//each
      console.log('--lst',lst)
      return lst
   }//()
   */

   clearFields(){
      localStorage.removeItem('row');
      $(this.form).find('input').val('')
   }
}