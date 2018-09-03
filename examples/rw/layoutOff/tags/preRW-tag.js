
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
    const dsettings = {  timestampsInSnapshots: true}
    db1.settings(dsettings)

    function isUserIn() {
       if(!auth.currentUser) return false
       return auth.currentUser.emailVerified
    }

    auth.onAuthStateChanged(function(user_) {
       if (isUserIn()) {
          console.log('CRUDauth', true)
       }
       else {
          console.log('CRUDauth','bye')
       }
    })

    function sendEmailVerification() {
       if(!isUserIn()) {
          console.log('sending', auth.currentUser)
          auth.currentUser.sendEmailVerification()
       }
       else
          console.log('no currentUser')
    }
});