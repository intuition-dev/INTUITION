class ServiceOne {
    constructor() {
        this.entityName = 'table_one2';
        this.dataSourceType = 'real';
    }
    read(ctx, cb) {
        console.log('--ViewModelDataServ reading...', ctx);
        if (this.dataSourceType == 'fake') {
            let rows = [
                { id: 1, col1: " Bob11", col2: "Bob12" },
                { id: 2, col1: " Bob21", col2: "Bob22" },
                { id: 3, col1: " Bob31", col2: "Bob32" }
            ];
            cb(rows, ctx);
            return;
        }
        const ref = db1.collection(this.entityName);
        const _this = this;
        ref
            .get()
            .then(function (querySnapshot) {
            let rows = [];
            querySnapshot.forEach(function (doc) {
                let row = doc.data();
                row['id'] = doc.id;
                rows.push(row);
            });
            cb(rows, ctx);
        })
            .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }
    add(row, resolve, reject) {
        if (row.id)
            delete row.id;
        let newPK = db1.collection(this.entityName).doc();
        newPK.set(row)
            .then(function () {
            console.log('successful');
            if (resolve)
                resolve(1);
        })
            .catch(function (error) {
            console.error('oops', error);
            if (reject)
                reject(error);
        });
        console.log(newPK);
        return newPK;
    }
}
