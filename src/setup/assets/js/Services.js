class Services {
    constructor(baseURL_) {
        console.info("--baseURL_:", baseURL_[1]);
        this.baseUrl = baseURL_;
        this.serviceRPC = new httpRPC(baseURL_[0], baseURL_[1], baseURL_[2]);
    }
    createConfig(serialised) {
        var email = serialised.filter(email => email.name == 'email')[0].value;
        var password = serialised.filter(password => password.name == 'password')[0].value;
        var emailjsService_id = serialised.filter(emailjsService_id => emailjsService_id.name == 'service_id')[0].value;
        var emailjsTemplate_id = serialised.filter(emailjsTemplate_id => emailjsTemplate_id.name == 'template_id')[0].value;
        var emailjsUser_id = serialised.filter(emailjsUser_id => emailjsUser_id.name == 'user_id')[0].value;
        var pathToSite = serialised.filter(path => path.name == 'path')[0].value;
        console.info("--email:", email);
        return this.serviceRPC.invoke('/setup', 'setup', {
            email: email,
            password: password,
            emailjsService_id: emailjsService_id,
            emailjsTemplate_id: emailjsTemplate_id,
            emailjsUser_id: emailjsUser_id,
            pathToSite: pathToSite
        })
            .then((result) => {
            console.info('test api: ', result);
            return result;
        }).catch((error) => {
            console.info("--error:", error);
        });
    }
    deleteTables() {
        this.serviceRPC.invoke('/delete', 'delete')
            .then((result) => {
            console.info('test api: ', result);
            return result;
        }).catch((error) => {
            console.info("--error:", error);
        });
    }
}
