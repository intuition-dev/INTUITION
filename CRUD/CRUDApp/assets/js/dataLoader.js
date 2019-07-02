
depp.require(['polly','spin'], onPoly)

depp.define({'CRUD':'/assets/models/CRUDViewModel.js'})

//load ViewModel
function onPoly() {
   depp.require('CRUD')
}
