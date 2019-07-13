
import { ADB } from './lib/ADB'
import { Email } from './lib/Email'

export class Setup {

adbDB: ADB
emailJs = new Email()

constructor(db) {
   this.adbDB = db
}


setup() {

}

}//class