
import { ADB } from 'intu/node-srv/lib/ADB';

export class SDB extends ADB {

    
    addTable() {

    }

    getAPIs() { // shipping api and maybe shoping api

    }

    getPrintfulAPI(): Promise<any> {
        return  new Promise((res, rej) => res('FAKE-API-ID'));
    }

}//class



