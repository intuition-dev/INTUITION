class Login {
	constructor() {
		this.IntuAPI = new IntuAPI()
	}

	checkUser(formLogin, formPassw) {
		console.info("--this.IntuAPI:", this.IntuAPI)
		this.IntuAPI.checkEditor(formLogin, formPassw)
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
	}
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