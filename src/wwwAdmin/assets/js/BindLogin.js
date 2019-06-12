/**
    Admin login
**/
class BindLogin {
    constructor() {
        this.AdminWebAdmin = new AdminWebAdmin()
    }
    login(email, pass) {
        this.AdminWebAdmin.checkAdmin(email, pass)
            .then(function(result) {
                console.info("--result:", result)
                if (result) {
                    window.sessionStorage.setItem('username', email);
                    window.sessionStorage.setItem('password', pass);

                    window.location = '/admin/home';
                } else {
                    window.location = '/admin'
                }
            })
    }

    setupShop(shopConfigs) {
        console.log("TCL: BindLogin -> setupShop -> shopConfigs", shopConfigs)
        var pathToShop = shopConfigs.filter(function(config) {
            if (config.name == 'path') {
                return config
            }
        })[0].value
        var snipcartApi = shopConfigs.filter(function(config) {
            if (config.name == 'snipcart') {
                return config
            }
        })[0].value

        this.AdminWebAdmin.setupShop(pathToShop, snipcartApi)
            .then(function(result) {
                console.info("--result:", result)
            })
    }

    signOut() {
        sessionStorage.removeItem('username');
        console.info("--sessionStorage:", sessionStorage)
        sessionStorage.removeItem('password');
        if (window.location.pathname !== '' && window.location.pathname !== '/admin') {
            window.location.replace('/admin');
        }
    }

    sendVcode(email) {
        if (email !== '') {
            this.AdminWebAdmin.sendVcode(email)
                .then(function(result) {
                    console.info("--result:", result)
                })
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.AdminWebAdmin.resetPass(email, code, pass)
                .then(function(result) {
                    if (result) {
                        alert("Password changed")
                    } else {
                        alert("Error")
                    }
                    console.info("--result:", result)
                })
        }
    }
}