
class BindForm {// extends ViewModelDataServ {

   constructor(){
      super()
      this.form = ''
      this.data = typeof sessionStorage.getItem('row') !='undefined' && JSON.parse(sessionStorage.getItem('row'));
   }
   
   init(divId) {
      this.form = '#'+divId
      if( this.data !=null){
         this._onData()
      }
   }

   save() {
      let row = {}
      row['one'] = $(form1.one).val()
   }
   
   _onData() {
      const row = this.data
      let _this = this

      depp.require(['pre'], function() { 
            $(_this.form).find('input[name="col1"]').val(row['col1'])
            $(_this.form).find('input[name="col2"]').val(row['col2'])
            $(_this.form).find('input[name="id"]').val(row['id'])
      })
   }

   
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


   clearFields(){
      sessionStorage.removeItem('row');
      $(this.form).find('input').val('')
   }
}