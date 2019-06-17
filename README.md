
# Install WebAdmin Meta 'Intuition'

#### 'It will lead YOU in the right direction'

Meta Intuition is WebAdmin Screen to CMS, e-Com, et al. It is based on JavaScript and SQLite. It is using [markdown](https://daringfireball.net/projects/markdown/syntax), and is written on [pug](https://pugjs.org/api/getting-started.html).

In WebAdmin, you can edit pages' content using markdown which won't let you page become broken, you only edit the content/text itself and all other things is done for you after you click "save". It allows you clone existing pages to write another post/page, upload images and set publish date to posts. 

WebAdmin has **Admin screen** where you need to select type of site or choose the existing site to edit and **Editor screen** where you can perform operations with the content. WebAdmin also supports multiple editors users, which can be added in Admin screen and users will be notified about it via email.



- Docs: https://metabake.github.io/metaDocs


# Features

## Short Installation


1. Before you run, create free [emailJs](https://www.emailjs.com) account: so Meta Intuition accounts can be validated via email.
Also create a email template, and note your emailJs `user_id` and `template_id`, needed to send emails to users.

2. Create a (linux) instance in the cloud, for example on [Digital Ocean](www.digitalocean.com). 

2. Optional: If you will run a large site with terabytes and petabytes, create a NAS, or you can migrate later.

3. Install node, yarn

4. Then install the app:
    ```bash
    $ yarn global add intu
    ```

5. In Terminal run command to start the app: 
    ```
    $ intu
    ```

6. Setup configurations in the browser window `:9081/setup`
Remember your admin email and password. (TODO: Validate admin email, maybe via code)

7. Fast URL's
   `:9081/admin` - to add users
   `:9081/editors` - to edit site

8. Optional: Use HTTP server (eg: [Caddy](caddyserver.com)) to proxy :9081 to get **https**

**NOTE**: If you make a mistake, or want to start over: `$ yarn global remove intu` will remove the DB and installation. It will not remove your website or your 
website's content. But it will remove all the editor: you have to add them again.


(TODO: Change path, change port, extract CMS, eCom, Website, add existing app)

(TODO: a lot of noise on logger, add editor screen has 'old data', ~~tmake admin be editor auto~~, even if not listed, changed admin command: for admin )
(TODO: add editor does nothing, no logo - our logo only, adding an editor: no password!. during code they set password, list does not work )


# API for MetaBake and WebAdmin

- Use via https://unpkg.com/intu@0.9.12/www/assets/IntuAPI/IntuAPI.min.js
- or better via https://github.com/metabake/mBakeCli/tree/master/zBrowserServices/toolBelt

