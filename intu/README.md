
# Meta 'Intuition' WebAdmin

#### 'It will lead YOU in the right direction'

Meta Intuition is WebAdmin Screen to CMS, e-Com, et al. It is based on JavaScript and SQLite. It is using [markdown](https://daringfireball.net/projects/markdown/syntax), and is written on [pug](https://pugjs.org/api/getting-started.html).

In WebAdmin, you can edit content. As it is using markdown it won't let a page become broken, you only edit the content itself and all other things is done for you after "save". It allows you to clone existing pages, to write another post/page, to upload images and to set publish date to blog posts. 

WebAdmin generates a starter site to edit, eg: Website, CMS, Shop or you can choose your existing site. Application has **Admin screen** for all the settings and **Editor screen** where you can perform operations with the content. There is available multiple editors users support. Users can be added in Admin screen and they will be notified about it via email.


#### Please star our main project here:
- https://github.com/metabake/mbIntuition

# Features

- edit markdown content
- clone pages
- multiple users
- generates starter site to edit, eg: Website, CMS, Shop
- set publish date to posts
- files upload

# Full Docs

https://metabake.github.io/metaDocs


## Short Installation


1. Before you run, create free [emailJs](https://www.emailjs.com) account: so Meta Intuition accounts can be validated via email.
Also create a email template, and note your emailJs `user_id` and `template_id`, needed to send emails to users.

2. Create a (linux) instance in the cloud, for example on [Digital Ocean](www.digitalocean.com). 

2. Optional: If you will run a large site with terabytes and petabytes, create a NAS, or you can migrate later.

3. Install node, yarn

4. Then install the app:
    ```bash
    $ yarn add intu
    ```

5. In Terminal run command to start the app: 
    ```
    $ yarn run intu
    ```

6. Setup configurations in the browser window `:9081/setup`
Remember your admin email and password. (TODO: Validate admin email, maybe via code)

7. Fast URL's
   `:9081/admin` - to add users
   `:9081/editors` - to edit site

8. Optional: Use HTTP server (eg: [Caddy](caddyserver.com)) to proxy :9081 to get **https**

**NOTE**: If you make a mistake, or want to start over: `$ yarn global remove intu` will remove the DB and installation. It will not remove your website or your 
website's content. But it will remove all the editor: you have to add them again.


# API for MetaBake and WebAdmin

- Use via Metabake toolBelt https://cdn.jsdelivr.net/gh/metabake/metaCake@v2.0.4/toolBelt/toolBelt.js