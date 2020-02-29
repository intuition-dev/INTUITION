"use strict";
// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0
Object.defineProperty(exports, "__esModule", { value: true });
const superagent = require('superagent');
const bunyan = require('bunyan');
const bformat = require('bunyan-format2');
const formatOut = bformat({ outputMode: 'short' });
const log = bunyan.createLogger({ src: true, stream: formatOut, name: "Email" });
class Email {
    send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        email = Buffer.from(email, 'base64').toString();
        log.info('email_to: ', email);
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
            log.info('Email has been sent. ');
        })
            .catch(err => {
            log.info('send mail error: ', err);
        });
    } //()
} //class
exports.Email = Email;
