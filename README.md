
# MetaBake's 'Intuition' WebAdmin

#### 'It will lead YOU in the right direction'

Meta Intuition is WebAdmin Screen to CMS, e-Com, etc.  It is using [markdown](https://daringfireball.net/projects/markdown/syntax), and is written on [pug](https://pugjs.org/api/getting-started.html).

In WebAdmin, you can edit page content using markdown - which won't let you page become broken. It allows you clone existing pages to write another post/page, upload images, custom write own layout in pug and set publish date to posts. 

WebAdmin generates starter site to edit, eg: Website, CMS, Shop or you can choose your existing site. Application has **Admin screen** for all the settings and **Editor screen** where you can perform operations with the content. There is available multiple editors users support, which can be added in Admin screen and users will be notified about it via email.


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

3. Install node

4. Then install the app:
    ```bash
    $ npm i -g intu
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



# API for MetaBake and WebAdmin

Check here https://cdn.jsdelivr.net/gh/metabake/toolBelt@v2.0.17/toolBelt/toolBelt.js


# Links

- [MetaBake.org](https://www.MetaBake.org)
- [blog.MetaBake.net](http://blog.MetaBake.net)
- [Github](http://git.MetaBake.org)
