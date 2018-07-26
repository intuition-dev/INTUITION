
riot.tag2('formd-tag', '<form class="grid-form" id="f2" autocomplete="off"> <fieldset> <legend>RiotJS Tag</legend> <div data-row-span="2"> <div data-field-span="1"> <label> Data</label> <input type="text" name="dat" placeholder="more data"> </div> </div> </fieldset> </form> <div class="buts"> <button class="ui button" id="data" type="submit">Add data</button> </div>', 'formd-tag .buts button,[data-is="formd-tag"] .buts button{ margin: .5rem; }', '', function (opts) {
    console.log('oh hi')
    loadjs.ready('style', function () {
        console.log('auth', isUserIn())

        $('#data').click(function () {
            let data = $('#f2 [name="dat"]').val()
            console.log(data)

            console.log('auth', isUserIn())

            let newRow = {
                col1: data,
                col2: true,
                col3: 3.14159265
            }

            var newPK = db.collection('table_one').doc()

            newPK.set(newRow)
                .then(function () {
                    console.log('successful')
                })
                .catch(function (error) {
                    console.error('oops', error)
                })
        })

    })
});
