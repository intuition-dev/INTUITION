var ServiceOne = /** @class */ (function () {
    function ServiceOne() {
        this.entityName = 'table_one2'; //name of the collection in DB
        this.dataSourceType = 'real'; //real or fake
    }
    ServiceOne.prototype.read = function (ctx, cb) {
        console.log('- reading...', ctx);
        if (this.dataSourceType == 'fake') {
            var rows = [
                { id: 1, col1: " Bob11", col2: "Bob12" },
                { id: 2, col1: " Bob21", col2: "Bob22" },
                { id: 3, col1: " Bob31", col2: "Bob32" }
            ];
            cb(rows, ctx);
            return;
        }
        var ref = db1.collection(this.entityName);
        ref
            .get()
            .then(function (querySnapshot) {
            var rows = [];
            querySnapshot.forEach(function (doc) {
                var row = doc.data();
                row['id'] = doc.id;
                rows.push(row);
            });
            cb(rows, ctx);
        })["catch"](function (error) {
            console.log("Error getting documents: ", error);
        });
    }; //()
    ServiceOne.prototype.add = function (row, cb) {
        if (row.id)
            delete row.id; // that should not be there on add
        var newPK = db1.collection(this.entityName).doc(); // make PK
        newPK.set(row) // insert
            .then(function () {
            console.log('successful');
            if (cb)
                cb(1);
        })["catch"](function (error) {
            console.error('oops', error);
        });
    }; //()
    ServiceOne.prototype.update = function (row, cb) {
        console.log(row);
        var id = row['id'];
        console.log(id, row);
        delete row.id; // we are not save pk in a row
        var ref = db1.collection(this.entityName).doc(id);
        ref.set(row) // save
            .then(function () {
            console.log('successful');
            if (cb)
                cb(1); //1 = ok
        })["catch"](function (error) {
            console.error('oops', error);
        });
        return id;
    }; //()
    ServiceOne.prototype["delete"] = function (row) {
        var id = row['id'];
        var ref = db1.collection(this.entityName).doc(id);
        ref["delete"]() // delete
            .then(function () {
            console.log('successfully deleted');
        })["catch"](function (error) {
            console.error('oops', error);
        });
    };
    ServiceOne.prototype.valid = function (row) {
        console.log(row);
        var col1 = row['col1'];
        var col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    };
    return ServiceOne;
}());
