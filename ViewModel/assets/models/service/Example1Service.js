class Example1Service {
    constructor() {
        this.entityName = 'table_one2';
    }
    read(id) {
        let _this = this;
        console.info('--reading...', Date.now() - _start);
        let ref = db1.collection(this.entityName);
        if (id) {
            return db1.collection(this.entityName).doc(id)
                .get()
                .then(function (docSnap) {
                let temp = docSnap.data();
                temp['id'] = docSnap.id;
                return temp;
            })
                .catch(function (error) {
                console.info("Error getting documents: ", error);
            });
        }
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
            .catch(function (error) {
            console.info("Error getting documents: ", error);
        });
    }
    add(row) {
        if (row.id)
            delete row.id;
        let newPK = db1.collection(this.entityName).doc();
        return newPK.set(row)
            .then(function () {
            console.info('successful');
        })
            .catch(function (error) {
            console.error('oops', error);
        });
    }
    update(row) {
        console.info(row);
        let id = row['id'];
        console.info(id, row);
        delete row.id;
        let ref = db1.collection(this.entityName).doc(id);
        return ref.set(row)
            .then(function () {
            console.info('successful');
            return id;
        })
            .catch(function (error) {
            console.error('oops', error);
        });
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
        let col1 = row['col1'];
        let col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    }
}
