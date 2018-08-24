
riot.tag2('ro-tag', '<form class="grid-form" id="f2" autocomplete="off"> <fieldset> <legend>RiotJS Tag</legend> <div data-row-span="2"> <div data-field-span="1"> <label> Data</label> <input type="text" name="dat" placeholder="more data"> </div> </div> </fieldset> </form> <div class="buts"> <button class="btn" id="data" type="submit">Add data</button> </div>', 'ro-tag .buts button,[data-is="ro-tag"] .buts button{ margin: .5rem; }', '', function(opts) {
    const fconfig = {
    	apiKey: 'AIzaSyASZVGB4'+'s'+'1uKB4OdxPCcbJ3ebf44KUYdIE',
    	authDomain: 'mbake1-1.firebaseapp.com',
    	projectId: 'mbake1-1'
    }

    firebase.initializeApp(fconfig)

    const db  = firebase.firestore()
    const dsettings = {  timestampsInSnapshots: true}
    db.settings(dsettings)

    console.log('oh hi')
    loadjs.ready('style', function () {

       $('#data').click(function(){
          let data = $('#f2 [name="dat"]').val()
          console.log(data)

          newPK.set(newRow)
             .then(function() {
                console.log('successful')
             })
             .catch(function(error) {
                console.error('oops', error)
             })
       })

    })
});