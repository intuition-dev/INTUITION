import {readFromTableOne} from './service/FunctionalService'
import {FAKEDATA} from './service/utilities/dummyData';


/*Because our viewmodel is closer in the system to the BindClass and the UI part
We start to define a class with methods an attached data. 
However, we can stil make use or our FP approach in service.
*/
export default class FunctionalViewModel {
    _data: object[] = []
    dataSourceType: string = 'real' //We switch between real or fake data


    //Instead of a switch we use an object literal:
    getViewList = (table) => ({
        'table1': this.dataSourceType === 'fake' ? FAKEDATA : this._data
    })[table]

    read = () => {
        let _this = this
        return Promise.all([readFromTableOne()]).then( data => _this._data = data[0])
    }
}