
riot.tag2('ro-tag', '<hr> <p>{dat}</p> <hr> <div class="buts"> <button class="btn" id="data" type="submit">Get data</button> </div>', 'ro-tag .buts button,[data-is="ro-tag"] .buts button{ margin: .5rem; }', '', function(opts) {
    const fconfig = {
    	apiKey: 'AIzaSyASZVGB4'+'s'+'1uKB4OdxPCcbJ3ebf44KUYdIE',
    	authDomain: 'nbake1-1.firebaseapp.com',
    	projectId: 'nbake1-1'
    }

    firebase.initializeApp(fconfig)

    const db  = firebase.firestore()
    const dsettings = {  timestampsInSnapshots: true}
    db.settings(dsettings)

    console.log('oh hi')
    thiz = this
    this.on('mount', function(){

       loadjs.ready('style', function () {
       let tableOneRef = db.collection('table_one')

       $('#data').click(function(){
          console.log('click')

          tableOneRef.get().then(function(querySnapshot) {
             console.log('back')
             querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                thiz.update({dat: doc.data()})
                })
             })

          })

       })

    })
});