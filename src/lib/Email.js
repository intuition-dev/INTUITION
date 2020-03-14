"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const superagent = require('superagent');
const terse_b_1 = require("terse-b/terse-b");
class Email {
    constructor() {
        this.log = new terse_b_1.TerseB(this.constructor.name);
    }
    send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        email = Buffer.from(email, 'base64').toString();
        this.log.info('email_to: ', email);
        superagent.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: emailjsService_id,
            template_id: emailjsTemplate_id,
            user_id: emailjsUser_id,
            template_params: {
                to_name: email,
                message_html: msg,
                email_to: email
            }
        })
            .then(res => {
            this.log.info('Email has been sent. ');
        })
            .catch(err => {
            this.log.warn('send mail error: ', err);
        });
    } //()
} //class
exports.Email = Email;
