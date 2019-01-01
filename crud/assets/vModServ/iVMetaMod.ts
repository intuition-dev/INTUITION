// What is a View-Model?: An object(|array) whose properties match a form(|table|chart)
// License LGPL v2.1, Copyright MetaBake.org | Cekvenich

// Ver YY/MM:  18/12/29: Orig
// Features 1: UI only add/remove fields binding
// Features 2: allow iterative development of UI first AND: independence of view(Pug) from model services
// So faster prototyping and cheaper maintenance. Future lower latency via service worker
// Likely you want split screen for Model and Pug

// TL-DR: 1. UI first, then DB. 2.Set false data as fake first via IDE

// For tsc to work, run: npm i @types/jquery # to get jq types

// nameVMod.ts or VMModName must match page/screen name. 
// =====================================================
interface IVModServ {// contains CRUD and API calls, converts entity/service so that properties match/map the view:screen/page/form/table/chart; 
   dataSourceType: string;// during prototype 'fake', or for speed 'cached' else 'real', 'offline', 'failOver', end-point-by-customer, etc.
   _disE(data: any, ctx:IDBinding): void //private method to broadcast a data event after a read, fetch, etc.
   addModListener(binder: IDBinding): void; //from ViewBinder, add listener _onData (~Flux)
   entityName: string

   page: string; // get url this View Model instance was instantiated on
   valid(arg?:any): string;// run valuation. return's 'OK' or error:String
   isAuth(arg?: any): boolean; // is user authenticated for this
}

interface IDBinding {// execute the mapping of fields, auto if possible.
   init(divId: string, ctx?:any): void; // starting point. create the IVModServ impl
   getVMod(opArg?: string): IVModServ;// page should eschew talking to mod services direct, let binding class do it
   _onData(evt: any): void;// method to handle data event from vmod, evt.detail instance

   getClassName():string
   getFields(): any; // return the fields names dynamically by examining DOM as structure from form, html table or chart; even if nested

   popError(arg: {} ): void; // pops up error message
   log(msg:string):void // local or user
}


interface IVModTest { // a class used to rest the model above
   init(): void
   xTests(): string;//execute use case integration tests; 'OK' or error:String,
   cleanUp(): void
   getVMod(opArg?: string): IVModServ;// page should eschew talking to mod services direct, let binding class do it
}

// Business Logic: in page

// Keep Pug inheritance only one level

// Have pgLoader

// Tags only as decorative/minor widgets

// 3rd has 3rd party

// leverage spectre css

// future idea: (display) Cache then (display) network: https://jakearchibald.com/2014/offline-cookbook 