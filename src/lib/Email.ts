// All rights reserved by Cekvenich|INTUITION.DEV) |  Cekvenich, licensed under LGPL 3.0

const superagent = require('superagent');

import { TerseB } from "terse-b/terse-b"

export class Email {
    log:any = new TerseB(this.constructor.name) 

    send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        email = Buffer.from(email, 'base64').toString()
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
                this.log.info('Email has been sent. ')
            })
            .catch(err => {
                this.log.warn('send mail error: ', err)
            });
    }//()
    
}//class

