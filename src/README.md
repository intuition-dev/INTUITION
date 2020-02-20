
# INTUITION.DEV

#### INTUITION.DEV is the futuristic open source bundler/builder for pro developers with 10-fold productivity via automation, low-code, cross-platform, static-generator, and a built-in WebAdmin editor, leveraging JAMstack, w/ Pug and facilitating app maintenance by end-users.

#### Please star our main project here:
- https://github.com/INTUITION-dev/INTU

## INTUITION.DEV approach:

In a future with increasing automation, citizen-developers have become more widespread. Nowadays almost anyone can pull out a form or a web app using low-code tools. Unlike other low-code tools, this one is aimed at professional developers and uses a standard language: Pug. We started first with a static code generator that leverage JAMstack, w/ Pug. And then added a WebAdmin that lets you edit—and then keep adding features. 
[Medium Article](https://medium.com/@uptimevic/how-software-developers-can-survive-the-coming-tech-crash-796dd8dc5a7e) 

### INTUITION.DEV pro development features:

1. Standards Based / Pug
1. Open Source
1. SEO
2. CRUD | ViewModel
2. built in user auth
2. FTS and SQL
2. keyboard driven (F12 Custom Elements In V1.1)
2. cross platform / mobile from single code base


### Easy

<img src="https://github.com/INTUITION-dev/INTU/raw/master/src/intu.png" width="100%"/>


We have open source low-code with static generation with the ability to add a ‘WebAdmin’ editor to INTUITION.DEV and your application. Once a professional developer writes and sets up Version 1 of the app, end-users can be enabled to maintain the app and possibly write the next version of the app. As the business needs change, the resulting evergreen web app is always aligned to the business.

You can write any and every kind of app, since we generate HTML, javascript an css. Our main language is Pug, if you have not seen Pug before, here is a quick intro to Pug:
- [Click for generic Pug example](http://pug.metabake.net)


## Installation and Intro

1. Before you run, create free [emailJs](https://www.emailjs.com) account: so that INTUITION.DEV your local accounts can be validated via email. Also create a email template, and note your emailJs `service_id`, `user_id`,  `template_id`, needed to send validation emails. Yes, user admin is built in.

2. Then install the INTUITION.DEV tool:

Note: Some of the upstream packages we user are native, so you need to : apt-get install build-essential or similar to get the platfrom C compiler. https://github.com/npm/cli/issues/287

```sh
    apt-get install build-essential
    npm i -g npm@next
    npm i -g node-gyp@latest 
    node-gyp -v
    npm i -g --unsafe-perm=true --allow-root intu
```

Edit intu-config.yaml to set the admin password, and where your webapp will reside.
And you have to restart intu.

3. Configure email. You'll need an account on emil
   Remember your admin email and password.
   Once you login as admin: add a user

4. URL's
   `:9081/admin` - to add end-users
   `:9081/edit` - to edit site

IMPORTANT: you  must go to admin/settings to configure email.

5. You can edit the small app in ROOT, that you can see at `:9081/`

6. For a more realistic app, in Terminal run command to create a sample CRUD app: 
    ```
    intu -c
    cd CRUD
    npm
    ```


### Links
- [INTUITION Docs](http://intuition-dev.github.io/intuDocs)
- [Home Page](https://www.INTUITION.DEV)
- [mbake CLI Docs](http://intuition-dev.github.io/mbCLI)
- [Git Repo](http://git.metabake.net)
- [Slides] (https://github.com/INTUITION-dev/INTUDocs/blob/master/slides/slides.md)

