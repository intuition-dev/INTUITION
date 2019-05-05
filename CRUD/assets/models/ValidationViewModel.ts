declare let validator;

// Needs CRUD methods
class ValidationViewModel {

   valid(row) {
      let col1 = row['col1']
      let col2 = row['col2']
      if (validator.isEmpty(col1, { ignore_whitespace: true }))
         return 'Col1 is blank'
      if (validator.isEmpty(col2, { ignore_whitespace: true }))
         return 'Col2 is blank'
      return 'OK'
   }
}