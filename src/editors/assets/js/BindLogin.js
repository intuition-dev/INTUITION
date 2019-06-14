/**
    Editor reset password
**/
class BindLogin {
    constructor() {
        this.WebAdmin = new WebAdmin();
    }

    sendVcode(email) {
        if (email !== '') {
            this.WebAdmin.sendVcodEditor(email)
                .then(function(result) {
                    console.info("--result:", result);
                });
        }
    }

    resetPass(email, code, pass) {
        if (email !== '' && pass !== '' && code !== '') {
            this.WebAdmin.resetPassEditor(email, code, pass)
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