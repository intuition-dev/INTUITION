class BaseVMod {
    constructor() {
        this.dataSourceType = 'real';
        this.page = window.location.href;
    }
    _disE(data, ctx) {
        const msg = {
            data: data,
            ctx: ctx
        };
        dispatchEvent(new CustomEvent('VMod', { detail: msg }));
    }
    addModListener(binder) {
        addEventListener('VMod', binder._onData);
    }
    read(ctx) {
        console.log('reading...', Date.now() - _start);
        if (this.dataSourceType == 'fake') {
            let rows = [
                { id: 1, col1: " Bob11", col2: "Bob22" },
                { id: 2, col1: " Bob11", col2: "Bob22" }
            ];
            this._disE(rows, ctx);
            return;
        }
        const ref = db1.collection(this.entityName);
        const THIZ = this;
        ref
            .get()
            .then(function (querySnapshot) {
            let rows = [];
            querySnapshot.forEach(function (doc) {
                let row = doc.data();
                row['id'] = doc.id;
                rows.push(row);
            });
            THIZ._disE(rows, ctx);
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
    update(row, resolve, reject) {
        console.log(row);
        let id = row['id'];
        console.log(id, row);
        delete row.id;
        let ref = db1.collection(this.entityName).doc(id);
        ref.set(row)
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
        return id;
    }
}
class BaseDBind {
    log(msg) {
        console.log(msg);
    }
    popError(arg) {
        console.log(arg);
        swal(arg);
    }
    getClassName() {
        return this.constructor.name;
    }
    setFields(row, ctx) {
        console.log(ctx.form);
        let input = $(ctx.form + ' [name="id"]');
        input.val(row['id']);
        let fields = Object.keys(row);
        fields.forEach(function (field) {
            var input = $(ctx.form + ' input[name=' + field + ']');
            input.val(row[field]);
        });
    }
    clearFields() {
        let input = $(this.form + ' [name="id"]');
        input.val('');
        $(this.form + ' input').each(function (index) {
            let input = $(this);
            input.val('');
        });
    }
    getFields() {
        let lst = {};
        let input = $(this.form + ' [name="id"]');
        lst['id'] = input.val();
        $(this.form + ' input').each(function (index) {
            let input = $(this);
            lst[input.attr('name')] = input.val();
        });
        console.log(lst);
        return lst;
    }
}
class Mod1 extends BaseVMod {
    constructor() {
        super();
        this.entityName = 'table_one2';
    }
    isAuth(arg) {
        throw new Error("Method not implemented.");
    }
    valid(row) {
        console.log(row);
        let col1 = row['col1'];
        let col2 = row['col2'];
        if (validator.isEmpty(col1, { ignore_whitespace: true }))
            return 'Col1 is blank';
        if (validator.isEmpty(col2, { ignore_whitespace: true }))
            return 'Col2 is blank';
        return 'OK';
    }
}
