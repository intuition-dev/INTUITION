
class FormBind {

   constructor() {
      this.form = ''
      this.id = typeof sessionStorage.getItem('id') != 'undefined' && JSON.parse(sessionStorage.getItem('id'))
      this.viewModel = new FormViewModel()
   }

   init(divId) {
      let _this = this
      this.form = '#' + divId
      if (this.id != null) {
         Promise.all([this.viewModel.read(this.id)])
            .then(function () {
               let data = _this.viewModel.getViewForm('form1')
               console.info("--data:", data)

               $('#form1').find('input[name="col1"]').val(data['col1'])
               $('#form1').find('input[name="col2"]').val(data['col2'])
               $('#form1').find('input[name="id"]').val(data['id'])
            })
      }
   }

   add(row) {
      let validation = this.viewModel.valid(row) //do the validation
      console.info("--validation:", validation)

      if (validation == 'OK')
         this.viewModel.add(row)
            .then(function () {
               window.location.replace('/screen/tabulator_form')
            })
      else {
         Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: validation,
         })
      } //else
   }

   update(row) {
      let validation = this.viewModel.valid(row) //do the validation

      if (validation == 'OK')
         this.viewModel.update(row)
            .then(function () {
               window.location.replace('/screen/tabulator_form')
            })
      else {
         // do the pop
         Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: validation,
         })
      } //else
   }

   delete(row) {
      this.viewModel.delete(row)
         .then(function () {
            window.location.replace('/screen/tabulator_form')
         })
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


   clearFields() {
      sessionStorage.removeItem('id');
      $(this.form).find('input').val('')
   }
}