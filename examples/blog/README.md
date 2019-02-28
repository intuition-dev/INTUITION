# Mount SFTP with blog site to linux machine via sshfs tool and CodeAnywhere editor

## Setup cloud dev.

1. Setup up a Linux box in the cloud, e.g. [Digital Ocean](www.digitalocean.com).

1. Change the root password for DO linux box. Connect by ssh in terminal. It will ask to enter existing password and then new password:

        $ ssh root@[IP-Address]

1. Setup a Web IDE account, e.g. [CodeAnywhere](https://codeanywhere.com) online text editor (hereafter CA)

1. In CA, connect to the Linux box.

1. In CA, open SSH to the Linux box.



###  Mount SFTP through sshfs

2. Login to CA and create a `new connection` to connect to your recently created Linux box in Digital Ocean.
3. Open terminal in CA in this linux box and install `sshfs` for mount:

		$ apt install aptitude
		$ apt-add-repository universe
		$ sudo apt-get install sshfs
		$ mkdir mount // change [mount] with any name you like
		$ sshfs user_kpq3rmpl@push-33.cdn77.com:/ mount
		// ($ sshfs [user]@[host]:/ [name-of-folder-to-mount-in]) 
		// command to unmount folder, in case you will need it:
		// $ umount [folder-name]

	now you will have a mount directory in your linux box that has mounted CDN Storage inside.
	For more information on installing sshfs on linux check [Using SSHFS To Mount Remote Directories](https://www.linode.com/docs/networking/ssh/using-sshfs-on-linux/)

1. Then on linux box install node, yarn and mbake.
1. In the `mount/www` folder do a command:

		$ mbake -b
		
	it will download website example source code to the `mount/www` folder, 
	or upload another source code in this folder.

1. Create folder for Blog CMS Editor App in your Linux machine terminal in CodeAnywhere editor (hereinafter CA) and download Blog CMS App to this folder, change `blog-cms` with your own name:
    ```sh
    $ mkdir blog-cms
    $ cd blog-cms
    $ mbakeW -c
    ```

1. The Blog CMS App source code will be downloaded to `blog-cms` folder. Check `README.md` file in the root of `blog-cms` folder for deploy instructions