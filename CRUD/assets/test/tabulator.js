beforeEach = function () {
   return function () {
      oe = {};

      table = document.getElementById('example-table').cloneNode(true);
      table_cloned = document.getElementById('qunit-fixture').appendChild(table);

      $table = new Tabulator(table_cloned, {
         data: [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
         ],
         columns: [ //Define Table Columns
            { title: "Name", field: "name", width: 150 },
            { title: "Age", field: "age", align: "left", formatter: "progress" },
            { title: "Favourite Color", field: "col" },
            { title: "Date Of Birth", field: "dob", sorter: "date", align: "center" },
         ]
      });
      console.info("--$table:", $table)
   };
},
   afterEach = function () {
      return function () {
         oe = {};
         $('#qunit-fixture').find('#example-table').remove()
         $table.destroy();
      };
   };

QUnit.module('Sorting the table', {
   beforeEach: beforeEach(),
   afterEach: afterEach()
});

QUnit.test('sorting name column', function (assert) {
   $('.tabulator-col.tabulator-sortable[tabulator-field="name"]').click()
   assert.strictEqual($('.tabulator-col.tabulator-sortable', table_cloned).attr('tabulator-field'), 'name', 'column "name" have been sorted');
});
