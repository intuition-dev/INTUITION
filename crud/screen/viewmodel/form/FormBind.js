
class FormBind {

   constructor(){
      this.form = ''
      this.row = typeof sessionStorage.getItem('row') !='undefined' && JSON.parse(sessionStorage.getItem('row'))
      this.data = new OneModel()
   }

   init(divId){
      
      this.form = '#'+divId
      if( this.row !=null){
         this.onCB() //run 'onCB' only when there was a click on the row in the table, other way no data needed in the form
      }
   }

   add(row) {
      let validation = this.data.valid(row) //do the validation
      
      if(validation=='OK')
         this.data.add(row)
      else  {
         console.log('error', validation)
      } //else
   }

   update(row) {
      let validation = this.data.valid(row) //do the validation
      
      if(validation=='OK')
         this.data.update(row)
      else  {
         console.log('error', validation)
      } //else
   }

   delete(row) {
      this.data.delete(row)
   }
   
   onCB() {
      let _this = this

      $(_this.form).find('input[name="col1"]').val(this.row['col1'])
      $(_this.form).find('input[name="col2"]').val(this.row['col2'])
      $(_this.form).find('input[name="id"]').val(this.row['id'])
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