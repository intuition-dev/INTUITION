import { compose } from './utilities/functionalUtilities'
import { read, add, update, remove, getFromDatabase } from './utilities/functionalCRUD'


const getTableOneFromDb1 = getFromDatabase('table_one2')

export const readFromTableOne = compose(
    read,
    getTableOneFromDb1
)

export const addInTableOne = compose(
    add,
    getTableOneFromDb1
)

export const updateInTableOne = compose(
    update,
    getTableOneFromDb1
)

export const deleteFromTableOne = compose(
    remove,
    getTableOneFromDb1
)


