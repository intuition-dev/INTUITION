
class ValidationBind {

   constructor() {
      this.form = ''
      this.id = typeof sessionStorage.getItem('id') != 'undefined' && JSON.parse(sessionStorage.getItem('id'))
      this.viewModel = new ValidationViewModel()
   }

   validation(row) {
      let validation = this.viewModel.valid(row) //do the validation
      console.info("--validation:", validation)

      if (validation == 'OK')
         Swal.fire({
            type: 'success',
            title: 'Great job!',
            text: 'validation has been passed',
         })
      else {
         Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: validation,
         })
      } //else
   }

   getFields() {
      let lst = {}
      //start w/ pk
      let input = $(this.form + ' [name="id"]')
      lst['id'] = input.val()

      $(this.form + ' input').each(
         function (index) {
            let input = $(this)
            lst[input.attr('name')] = input.val()
         }//index
      )//each
      console.info('--lst', lst)
      return lst
   }//()

}