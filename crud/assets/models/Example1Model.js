class Example1Model {
    constructor() {
        this.entityName = 'table_one2';
        this.dataSourceType = 'fake';
        this._data = [];
    }
    getViewList(params) {
        return this._data.map((d) => {
            let temp = {};
            params.map((p) => {
                if (Object.keys(d).includes(p)) {
                    temp[p] = d[p];
                }
            });
            return temp;
        });
    }
    read() {
        let _this = this;
        console.info('--reading...', Date.now() - _start);
        if (this.dataSourceType == 'fake') {
            let rows = [
                { id: 1, col1: " Bob11", col2: "Bob12" },
                { id: 2, col1: " Bob21", col2: "Bob22" },
                { id: 3, col1: " Bob31", col2: "Bob32" },
            ];
            this._data.push(...rows);
            return;
        }
        const ref = db1.collection(this.entityName);
        return ref
            .get()
            .then(function (querySnapshot) {
            let rows = [];
            querySnapshot.forEach(function (doc) {
                let row = doc.data();
                row['id'] = doc.id;
                rows.push(row);
            });
            return rows;
        })
            .then(function (data) {
            _this._data.push(...data);
        })
            .catch(function (error) {
            console.info("Error getting documents: ", error);
        });
    }
    add(row, cb) {
        if (row.id)
            delete row.id;
        let newPK = db1.collection(this.entityName).doc();
        return newPK.set(row)
            .then(function () {
            console.info('successful');
            if (cb)
                cb(1);
        })
            .catch(function (error) {
            console.error('oops', error);
        });
    }
    update(row, cb) {
        console.info(row);
        let id = row['id'];
        console.info(id, row);
        delete row.id;
        let ref = db1.collection(this.entityName).doc(id);
        ref.set(row)
            .then(function () {
            console.info('successful');
            if (cb)
                cb(1);
        })
            .catch(function (error) {
            console.error('oops', error);
        });
        return id;
    }
    delete(row) {
        let id = row['id'];
        let ref = db1.collection(this.entityName).doc(id);
        return ref.delete()
            .then(function () {
            console.info('successfully deleted');
        })
            .catch(function (error) {
            console.error('oops', error);
        });
    }
    valid(row) {
        console.info(row);
        let col1 = row['col1'];
        let col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    }
}
