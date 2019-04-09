<img src="http://metabake.github.io/mbakeDocs/logo.jpg" width="100">

Demo: http://youtube.com/watch?v=B-mSA71S7VY

# CRUD Examples

There are four basic examples:

- Table with basic onClick event (tabulator.js)
- Table with Firestore binding (firestore data biding)
- Form Validation (validator.js in conjunction with sweetalert2.js)
- Authentication (firestore authentication)

## Structure explanation based on  "Table with basic onClick event" example

- screen/tabulator/index.pug: View
- screen/tabulator/TabulatorBind.js: binds TabulatorViewModel.js to the View
- assets/models/TabulatorViewModel.js: VM(view model) that reflects the View


## CRUD w/ ViewModel (VM) 

You can use any framework or library with MetaBake&trade;. And MetaBakecomes with a recommended 'app framework' for WebApps in 3 lines:


      interface iVM {
         getViewChart(name?:string):any 
         getViewList(name?:string):any 
         getViewForm(name?:string):any 
      }


This is somewhat similar to M-VM-V. Major difference is that the VM for MetaBakeis
what KnockOut called Complex VM or a Master VM.
Minor difference is that the M is called Services in MetaBake&trade;. (and V is Pug for us). So this is S-VM-V architecture.

Since it is an interface and .js has no interfaces it is just to guide you: When you write a Model, it must map to the View(the entire Pug page|screen, that has *state* via query string, eg: &cust=102).
So how to use:
- Your model must map to the view!
- If you have 2 tables in your view, you should have 2 lists in the model. If you have 2 forms in view, you should have 2 object in your model. etc.
- When you read() or fetch() from binding or page, the read() | fetch() should return one of the 3 methods above.
- In you read|fetch you can use promises, callbacks or events or even flux like events.

The goal is to be as flexible as possible. When you have a form, table or chart, you must have a VM. 

(if you create includes, tags/components, you should pass the VM to it)

VM also has a dataSourceType: string = 'real'  //real or fake

VM should also do any data validation; returning an empty string if OK or an error message.
The purpose of VM is to allow development of View to be faster; and to allow for a demo if back end is b0rked.

The iVM methods should return a Collection|Data Structure, collections.js is included in /assets/3rd
- http://www.collectionsjs.com

### Advanced
- The collections.js has events(via Range-Changes collection), so you could use FLUX, but FLUX is not recommended.
- You should favor composition over inheritance. You should even look at VM as an ECS(Entity-Component-System), where Entity is the name of the VM, 
and it must match the name of the page/screen folder; the components is the IVM methods that return the Collection|Data Structures 
that map to view, and systems are your CRUD type methods.
eg. ECS: http://archive.is/yRvvG
- Services classes should be documented via document.js
- If an event bus is needed by the view, you can use browsers's built in Custom Events to wire VM, binding, screen and components. 
- If you want to do testing, you test VM (not the View; test the ViewModel, eg. via: http://qunitjs.com )

# Other

- You should know some Firestore  already.
- Tutorial would show tabulator.js, forms

- Using ViewModel pattern to separate the data from views

- all models in assets/models that gets bind in screen/...

Your VM must map to the (pug) View!



## Continue

Please remember to continue your tutorial
