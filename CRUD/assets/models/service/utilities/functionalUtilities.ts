/*
==================
Lets define compose and a pipe utility functions for demo purposes. 
These functions are provided already in FP flavored libraries like Ramda, Lodash, etc.
=================
*/

// we use the rest operator in arguments to accomodate for any number of them

//Order of application from right to left (or bottom to top)
export const compose = (...functions) => initValue => functions.reduceRight( (accFn, fn )=> fn(accFn), initValue)

//Order of application from left to right (or top to bottom)
export const pipe = (...functions) => initValue => functions.reduce( (accFn, fn) => fn(accFn), initValue)
