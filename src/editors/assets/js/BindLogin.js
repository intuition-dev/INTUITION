/**
    Editor reset password
**/
class BindLogin {
    constructor() {
        this.IntuAPI = new IntuAPI();
    }

    sendVcode(email) {
        if (email !== '') {
            this.IntuAPI.sendVcodEditor(email)
                .then(function(result) {
                    console.info("--result:", result);
                });
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.IntuAPI.resetPassEditor(email, code, pass)
                .then(function(result) {
                    if (result) {
                        alert("Password changed");
                    } else {
                        alert("Error");
                    }
                    console.info("--result:", result);
                });
        }
    }
}