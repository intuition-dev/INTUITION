// This should allow you to add/remove DB fields in DOM. Fluid?

// FORM ////////////////////////////////////////////////////////////////
function setFields(row, form) {
   //set PK in hidden field
   let input = $(form+' [name="id"]')
   input.val(row['id'])

   let fields = Object.keys(row)
   fields.forEach(function(field) {
      let input = $(form+' input[name='+field+']')
      input.val(row[field])
   })
}//()

function clearFields(form) {
   //set PK in hidden field
   let input = $(form+' [name="id"]')
   input.val('')

   $(form+' input').each(
      function(index){  
         let input = $(this)
         input.val('')
      }//index
   )//each
}//()

function getFields(form) {
   let lst = {}
   //start w/ pk
   let input = $(form+' [name="id"]')
   lst['id'] = input.val()
 
   $(form+' input').each(
      function(index){  
         let input = $(this)
         lst[ input.attr('name')] = input.val()
      }//index
   )//each
   console.log(lst)
   return lst
}//()

// RW ////////////////////////////////////////
function read(resolve, reject) {
   if(!resolve)  {
      throw new Error('how to return data?')
   }
   console.log('reading...')
   let ref = db1.collection(window.tableName)
   ref // .where("capital", "==", true)
      .get()
      .then(function(querySnapshot) {
         let rows = []

         querySnapshot.forEach(function(doc) {
            let row = doc.data()
            row['id'] = doc.id
            rows.push(row)  
         })
         resolve(rows)
      })
   .catch(function(error) {
      console.log("Error getting documents: ", error)
      if(reject) reject(error)
   })
}

function add(row, resolve, reject) {
   if(row.id) delete row.id // that should not be there on add

   let newPK = db1.collection(window.tableName).doc() // make PK
   newPK.set(row) // insert
      .then(function() { 
         console.log('successful')
         if(resolve) resolve(1)
      })
   .catch(function(error) {
      console.error('oops', error)
      if(reject) reject(error)
   })
   console.log(newPK)
   return newPK
}//()

function update(row, resolve, reject) {
   console.log(row)
   let id = row['id']
   console.log(id, row)
   delete row.id // we are not save pk in a row

   let ref = db1.collection(window.tableName).doc(id)
   ref.set(row) // save
      .then(function() { 
         console.log('successful')
         if(resolve) resolve(1)//1 = ok
      })
   .catch(function(error) {
      console.error('oops', error)
      if(reject) reject(error)
   })
   return id
}//()
