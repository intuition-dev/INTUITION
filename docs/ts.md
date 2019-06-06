
## TypeScript

TypeScript is supper-set of JavaScript. Write a ts file, like foo.ts:
```ts
foo(i:number) {
    console.log('oh hi')
}
```
and run
```sh
mbake -t .
```
It will create a .js and min.js files. It will output ES5 to support IE11, so feel free to use class { } syntax. 
If there is no .ts, than it will simply slightly mimifify js files into min.js (but no ES5 conversion).

---
(of course you have to load any polyfills like
promises, fetch or what you need)

And normally you run that command at the root of your web-app; but don't use it for server-side nodejs.

## Services

TypeScript is often uses to call Services|APIs via browser's fetch() (used to be Ajax).
Modern services are now written in Google FireStore and to lesser degree AWS Amplify. These 
modern type of services help maximite developer productivity. Services are used
to develope C.R.U.D. (CRUD: Create, Read, Update, Delete)/ dynamic web-apps.
 Google and AWS also offer nice user authentication functionality.

##### Even if you won't use Google FireStore: you should learn to use it, just to expose yourself to the modern services architecture! The documentation on their website is quite good, and makes it easy to develop CURD services.

When you call the services client-side, you can write a .ts class that has the CRUD calls - returning promises (or leveraging browser's Custom Events).
This is the class that your Pug(html really) will leverage for dynamic apps. There are much better ways, but just to remove they mystery, here is a (bad) example pseudo code:

```pug
.script
    var serv1 = new MyServices1() // this class should have your working FireStore service calls or similar code.
    var pro1 = serv1.getSome1()
    pro1.then(function(ret) {
        $('#someId1').val(ret.field1)
    })
```

There is also a realistic example CRUD web-app example if you continue reading to the end here: including table, forms, validation, authentication, and 'master/detail' (click on a row to zoom) functionality. The CRUD example also shows how to use the modern ViewModel application architecture. 

