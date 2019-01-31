
riot.tag2('prerw-tag', '', '', '', function(opts) {

    const fconfig = {
       apiKey: 'AIzaSyASZVGB4'+'s'+'1uKB4OdxPCcbJ3ebf44KUYdIE',
       authDomain: 'nbake1-1.firebaseapp.com',
       projectId: 'nbake1-1'
    }

    window.firebase.initializeApp(fconfig)
    window.auth =firebase.auth()
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    window.db1  = window.firebase.firestore()
});