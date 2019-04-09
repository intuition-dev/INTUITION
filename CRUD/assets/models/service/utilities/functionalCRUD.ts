/*
==============
Functional CRUD approach:
==============
*/

//These functions we can reuse across all of our services. We also provide a safe default database.
//So in case we don't specify the db, it will read from default.
//We may now use them for piping/composing further custom functionality.


export const getFromDatabase = (database = db1) => entity => database.collection(entity)

//We avoid the use of ifs, thanks to partial application and ternary operator
export const read = table => (id?: string) => 
    id
    ? table
        .doc(id)
        .get()
        .then(docSnap => {
        console.log(docSnap.data());
        return docSnap.data();
        })
        .catch(error => console.log("Woops, something went wrong: ", error))
    : table
        .get()
        .then(querySnapshot => {
        let rows = [];
        querySnapshot.forEach(docSnap => {
            let row = docSnap.data();
            row["id"] = docSnap.id;
            rows.push(row);
        });
        return rows;
        })
        .catch(error => console.log("Woops, something went wrong: ", error));

export const add = table => row => table.doc().set(row)
    .then(() => console.log('data added succesfully'))
    .catch((error: any) => console.log('woops, something went wrong', error))


export const update = table => row => table.doc(row['id']).set(row)
        .then( ()=> console.log('data updated succesfully') )
        .catch( (error: any) => console.log('Woops, something went wrong: ', error) )


//naming it remove due to colliding with 'delete' built-in JS operator.
export const remove = (table: any )=> row =>  table.doc(row['id']).delete()
                .then( () => console.log('data successfully deleted') )
                .catch( (error: any) => console.log('Woops, something went wrong: ', error) )



