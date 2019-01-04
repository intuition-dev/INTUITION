
class BindForm {

   constructor(){
      this.form = ''
      this.row = typeof sessionStorage.getItem('row') !='undefined' && JSON.parse(sessionStorage.getItem('row'))
   }

   init(data_, divId){
      this.data = data_
      this.form = '#'+divId
      this.onCB()
   }

   add(row) {
     this.data.add(row)
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