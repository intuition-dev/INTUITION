
# INTUITION.DEV

#### 'INTUITION.DEV is an open source tool for pro developers w/ 10 fold productivity; via automation, low-code, cross-platform static-generator, and a built-in WebAdmin editor - facilitating app maintenance by end users.'

#### Please star our main project here:
- https://github.com/intuition-dev/INTUITION

## INTUITION.DEV approach:

In a future with increasing automation, citizen-developers have become more widespread. Nowadays almost everybody can pull out a form or a web app using GUI tools.
In contrast to tools for citizen-developers: INTUITION.DEV aims to make professional developers more productive, 10 fold productivity increase; via automation, low-code, cross-platform static-generator, and a built-in WebAdmin editor - facilitating app maintenance by end users.'

INTUITION.DEV has WebAdmin Screen for any CRUD app, CMS, e-Com, Mobile, AMP, etc.  It uses [markdown](https://daringfireball.net/projects/markdown/syntax), and is written in [pug](https://pugjs.org/language/tags.html).

In WebAdmin, you can edit screen app or content using markdown or pug - which won't let you pages become broken. It also can leverage native custom elements/ standard web-components and use any framework. It allows you clone existing pages to write another post/page, upload images, custom write own layout in pug, etc. Any app that you can write or use in HTML, .js/.ts or css/SASS can leverage INTUITION.DEV. Since it is only CSS/.js/HTML there is almost no learning curve.  If you need to catch up, we recommend this book: ‘Design and Build Websites’ by Jon Duckett.


# INTUITION.DEV development productivity features:

- Any css framework, or default to BootStrap
- Any .js framework, or our own default: ViewModel
- Iterative development: reduce app maintenance and iteration cost via our WebAdmin editor.
- High productivity Low-Code: similar to MS PowerApps, Oracle Visual Builder, Coda.io, Wix Corvid; but for professional developers.
- Can leverage native custom elements/ standard web-components 
- Static Generator(similar to Hugo or Jekyll): You write Sass, Pug, .ts: it emits SEO friendly static content(including optional AMP) to the CDN.
- Cross Platform from single code base: Web, IOS, Android (similar to Google's Flutter, but instead leveraging Adobe's free https://Build.PhoneGap.com); but with working SEO. 
- Built-in support for I18N 
- A path of gradually adjusting/migrating other apps to use INTUITION.DEV tool. 
- 100% of our code is Open Source! What you build with the tools is your license.
- CRUD tutorial, and example apps.
- Built in auth, admin and adding users.
- Built in SQL support and FTS
- Built in file upload
- User-admin built in.
- Livereload of course. And browser extension to edit from www.
- Lazy loading capable (via require() dependencies, including popular dependencies already defined)  
- Keyboard centric (eg: F12 pulls up library of native custom elements)

# Documentation

[Docs](http://docs.mbake.org)

[Git Repo](http://git.mbake.org)

[Pug example](https://pug.mbake.org)

[INTUITION.DEV Home Page](https://www.INTU.DEV)


## Short Installation and Tutorial

1. Before you run, create free [emailJs](https://www.emailjs.com) account: so that INTUITION.DEV your local accounts can be validated via email. Also create a email template, and note your emailJs `service_id`, `user_id`,  `template_id`, needed to send validation emails. Yes, user admin is built in.

2. Then install the INTUITION.DEV tool:
    ```bash
    npm i -g intu
    ```
    or you can use yarn instead of npm anytime.

3. In Terminal run command to create a sample CRUD app: 
    ```
    intu -c
    cd CRUD
    npm i
    ```

4. Now you should follow the README.md file there for the full tutorial.
or
    ```
    node index.js
    ```

5. Setup configurations in the browser window `:9081/setup`
   Remember your admin email and password.

6. URL's
   `:9081/admin` - to add users
   `:9081/editors` - to edit site


## Software will eat the world: The digital revolution.
### We just need to make more software: better and faster.


# Links

[Docs](http://docs.mbake.org)

[Git Repo](http://git.mbake.org)

[Pug example](https://pug.mbake.org)

[INTUITION.DEV Home Page](https://www.INTU.DEV)
