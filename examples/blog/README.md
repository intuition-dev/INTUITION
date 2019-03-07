# Create linux machine, install Caddy with webDAV and mount folder from linux machine to your PC via Mountain Duck or on another linux machine 

mbake is Cloud v2.0. You do not need to install or maintain any HTTP, DB or any other server.

## Setup Caddy & webDAV for blog source code

1. Setup up a Linux box in the cloud, e.g. [Digital Ocean](www.digitalocean.com).

1. Change the root password for DO linux box. Connect by ssh in terminal. It will ask to enter existing password and then new password:

        $ ssh root@[IP-Address]

1. Setup a Web IDE account, e.g. [CodeAnywhere](https://codeanywhere.com) online text editor (hereafter CA)

1. In CA, connect to the Linux box.

1. In CA, open SSH to the Linux box.

1. Install yarn, mbake, typescript

1. On Linux machine, install Caddy with webDAV plugin, eg:

        $ curl https://getcaddy.com | bash -s personal http.webdav

1. Add `Caddyfile` to the root folder and config it, eg:

        :8080 {  #cdn would go to this 
            root /root/www
            gzip
            mime .css text/css
            # set user for the /webdav path
            basicauth /webdav admin 123123 
            webdav /webdav 
            
            log ../log1
            errors ../err1
        }

1. Create folder `www` and in this folder download blog source:

        $ mkdir www
        $ cd www 
        $ mbake -b 

        compile files:

        $ mbake -c .
        $ cd assets
        $ mbakeW -s .
        $ cd ..
        $ cd blog
        $ mbake -i .

1. Run Caddy server, from the root folder where Caddyfile is:
    
        $ caddy -conf Caddyfile 
        // or 
        $ caddy 
        // or (to leave caddy server running after you'll quit the terminal or close the CA tab)
        $ nohup caddy &

1. In browser open:
        http://157.230.189.157:8080/webdav

        login with login and password from Caddyfile and go to url, it should show your site from www folder:

        http://157.230.189.157:8080/


## Add CDN for your blog

1. Create an account on [CDN77](https://www.cdn77.com/) if you don't already have one.

1. Go to [CDN 77](https://client.cdn77.com) and create a resource for your linux machine: select `My Origin`, select `http://` and in the `domain` field type in the ip address of your linux machine and specify the port (8080 in our case)

1. Go to tab `other settings` and select `cache expiry` -- `10 minutes`, then go to `Purge` tab and `purge all files`. This action is needed to reduce the time of files caching.

1. To verify that the mount is working, you can edit some file and check if changes applied in the browser via the Endpoint URL from your recently created CDN Resource. For the url check tab `Overview` --> `CDN Resource URL` (note that it might pass some time, eg: 5 minutes for changes to apply).

## Mount on another linux machine

1. Setup up a Linux box in the cloud, e.g. [Digital Ocean](www.digitalocean.com).

1. Change the root password for DO linux box. Connect by ssh in terminal. It will ask to enter existing password and then new password:

        $ ssh root@[IP-Address]

1. In CA (assuming that you have an account in CA, done in previous tutorial), connect to the Linux box.

1. In CA, open SSH to the Linux box.


We'll be mounting using `davfs2` — a Linux file system driver that allows to mount a WebDAV resource.

1. Install `davfs2`

        ```sh
        $ cat <<EOF | sudo debconf-set-selections
        davfs2 davfs2/suid_file boolean false
        EOF
        $ sudo apt-get update
        $ sudo apt install -y davfs2
        ```

1. Reconfigure `davfs2` to enable to use `davfs` under unprivileged users

        ```sh
    	$ sudo dpkg-reconfigure davfs2
        ```

1.  Create a directory: 

        ```sh
        $ mkdir ~/.davfs2
        ```

    create file:

        ```sh
    	$ vim ~/.davfs2/davfs2.conf
        ```

    with contents:

        ```conf
        secrets /root/.davfs2/secret
        ```
    	// press `a` keyboard button to run edit mode --> edit file --> `esc` --> `:w`(for saving) --> `enter` --> `:q` (to quit the file) --> `enter` 

1. Edit `~/.davfs2/secrets` file to add credentials to remote WebDav diectory:

        ```sh
    	$ vim ~/.davfs2/secrets
        ```

    Add a line to the end of file in following style:

        ```conf
        https://<WebDav URI>   <username> <password>
        ```

    eg: 
        ```conf
        http://157.230.189.157:8080/webdav/www   admin 123123
        ```

    Set the permission: 

        ```sh
        $ chmod 600 ~/.davfs2/secrets
        ```

1. Make a directory in which you'll mount

        ```sh
        $ mkdir mount
        ```

    Add a line to `/etc/fstab` about the remote WebDav directory

        ```sh
    	$ vim /etc/fstab
        ```

        ```conf
        https://<WebDav URI> <mount point>
        davfs user,noauto,file_mode=600,dir_mode=700 0 1
        ```

    eg:
        ```conf
        http://157.230.189.157:8080/webdav/www /root/mount davfs user,noauto,file_mode=600,dir_mode=700 0 1
        ```

1. Add your user to the davfs2 group

        ```sh
        // check user:
        $ whoami
        $ sudo vim /etc/group
        ```

    Add your username as follows:

        ```conf
        davfs2:x:134:<username>
        ```

    eg:

        ```conf
        davfs2:x:134:root
    	```

1. That's it. You can use following commands without being a root user to mount/umount

        ```sh
        $ mount <mount point>
        $ umount <mount point>
        ```

    eg:

        ```sh
        $ mount /root/mount
        $ umount /root/mount
        ```

## Admin CMS deploy (on linux box with Caddy and source code of site)

1. Create folder for Blog CMS Editor App in your Linux machine terminal in CA and download Blog CMS App to this folder, change `blog-cms` with your own name:
    ```sh
    $ mkdir blog-cms
    $ cd blog-cms
    $ mbakeW -a
    ```

1. The Blog CMS App source code will be downloaded to `blog-cms` folder. Check `README.md` file in the root of `blog-cms` folder for deploy instructions.