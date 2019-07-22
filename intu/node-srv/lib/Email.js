"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var Email = (function () {
    function Email() {
    }
    Email.prototype.send = function (email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        email = Buffer.from(email, 'base64').toString();
        console.log('email --->  ', email);
        axios_1.default.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: emailjsService_id,
            template_id: emailjsTemplate_id,
            user_id: emailjsUser_id,
            template_params: {
                to_name: email,
                message_html: msg,
                email_to: email
            }
        })
            .then(function (res) {
            console.info('Email has been sent. Result', res);
        })
            .catch(function (err) {
            console.log('send mail error: ', err);
        });
    };
    return Email;
}());
exports.Email = Email;
module.exports = {
    Email: Email
};
