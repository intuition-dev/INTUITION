import { compose } from './utilities/functionalUtilities'
import { read, add, update, remove, getFromDatabase } from './utilities/functionalCRUD'



const getFromDb1 = getFromDatabase(db1)


export const readFromTableOne = compose(
    read,
    getFromDb1
)('table_one2')

export const addInTableOne = compose(
    add,
    getFromDb1
)('table_one2')

export const updateInTableOne = compose(
    update,
    getFromDb1
)('table_one2')

export const deleteFromTableOne = compose(
    remove,
    getFromDb1
)('table_one2')

