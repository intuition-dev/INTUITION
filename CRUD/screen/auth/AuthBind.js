class AuthBind {

   constructor() {
      this.form = ''
   }

   getFields(form) {
      let email = $('#' + form + ' input[name="email"]').val()
      let pswd = $('#' + form + ' input[name="pswd"]').val()

      return { email: email, pswd: pswd }
   }//()

   signup(row) {
      let email = row.email
      let pswd = row.pswd

      auth.createUserWithEmailAndPassword(email, pswd)
         .then(function (user) {
            bAuth.sendEmailVerification()
         })
         .catch(function (error) {
            Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: error,
            })
         })
   }

   signin(row) {
      let email = row.email
      let pswd = row.pswd

      auth.signInWithEmailAndPassword(email, pswd)
         .then(function (user) {
            Swal.fire({
               type: 'success',
               title: 'Great job!',
               text: 'Signed in successfully',
            })
         })
         .catch(function (error) {
            Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: error,
            })
         })
   }

   signOut() {
      auth.signOut()
   }

   sendPasswordResetEmail(row) {
      let email = row.email
      auth.sendPasswordResetEmail(email)
         .then(function (user) {
            Swal.fire({
               type: 'success',
               title: 'Great job!',
               text: 'Email with reset password have been sent',
            })
         })
         .catch(function (error) {
            Swal.fire({
               type: 'error',
               title: 'Oops...',
               text: error,
            })
         })
   }
}