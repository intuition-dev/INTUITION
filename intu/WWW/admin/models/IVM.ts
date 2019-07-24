export  interface iVM {

    /**
     * Return 2 objects if 2 forms
     * or return 2 objects if 2 components
     * or 2 arrays if 2 tables.
     * Or a mix: 1 form and 1 table and 1 components is 1 array and 2 objects
     */
    getData():Object

}