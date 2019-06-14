class Login {
	constructor() {
		// this.checkUser = this.checkUser.bind(this);
		// this.auth = this.auth.bind(this);
		this.WebAdmin = new WebAdmin()
	}

	checkUser(formLogin, formPassw) {
		console.info("--this.WebAdmin:", this.WebAdmin)
		this.WebAdmin.checkEditor(formLogin, formPassw)
			.then(function (result) {
				console.info("--result:", result)
				if (result) {
					window.sessionStorage.setItem('username', formLogin);
					window.sessionStorage.setItem('password', formPassw);

					let hash = location.hash;
					console.info("--hash:", hash)
					window.location.replace('/editors/edit/' + hash);

				} else {
					window.location = '/editors'
				}
			})
		// if ((formPassw !== '') && (formLogin !== '') && (formPassw !== null) && (formLogin !== null)) {
		// 	return this.serviceRpc.invoke('/api/editor/checkEditor', 'check-editor', { admin_email: email, admin_pass: pass })
		// 		.then(function () {
		// 			_this.serviceRpc.setUser(email, pass);
		// 			return true
		// 		})



		// 	auth.signInWithEmailAndPassword(formLogin, formPassw)
		// 		.then(user => {
		// 			if (user) {
		// 				this.auth();
		// 			}
		// 		})
		// 		.then(() => {

		// 			let hash = location.hash;
		// 			window.location.replace('/editors/edit/' + hash);

		// 		})
		// 		.catch(error => {
		// 			console.info('login error', error);
		// 			if (error.code === 'auth/wrong-password') {
		// 				$('#error').text('Wrong password').removeClass('d-hide');
		// 			} else if (error.code === 'auth/user-not-found') {
		// 				$('#error').addClass('d-hide').text('User not found, please check that login is correct').removeClass('d-hide');
		// 			}
		// 		});
		// } else {
		// 	console.info("All fields must be filled out");
		// 	return false;
		// }
	}
	// auth() {
	// 	// display username, get token and current user
	// 	firebase
	// 		.auth()
	// 		.onAuthStateChanged(user => {
	// 			if (user) {
	// 				// get user token and name
	// 				user
	// 					.getIdToken()
	// 					.then(idToken => {
	// 						sessionStorage.setItem('idToken', idToken);
	// 						window.sessionStorage.setItem('user_name', auth.currentUser.email);
	// 					});
	// 			} else {
	// 				if (window.location.pathname !== '/') {
	// 					window.location = ('/');
	// 				}
	// 			}
	// 		});
	// }
}

class SignOut {
	constructor() {
		this.signOut = this.signOut.bind(this);
	}
	signOut() {
		sessionStorage.clear();
		window.location = ('/editors');
	}
}

let logOut = new SignOut();

$('.sign-out').on('click', function (e) {
	e.preventDefault();
	logOut.signOut();
});