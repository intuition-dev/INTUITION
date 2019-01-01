# Blog app

Blog app consists of 3 parts:
* Admin app (`adminzAdminEG`) — the app to manage users, only admin user can log in it
* Editors app (`adminEditorsEG`) – the app to create, and edit blog posts. Only editor users can log in it
* Blog site – the site for all users where they can read blog posts

## Install 
* Copy configuration file
    ```sh
    $ cp adminEditorsEG/config.yaml.dist adminEditorsEG/config.yaml
    ```
* Edit `adminEditorsEG/config.yaml` configuration file

* Run mbake 
    ```sh
    $ cd adminEditorsEG/www/
    $ mbake .
    $ cd ../..
    $ cd adminzAdminEG/www/
    $ mbake .
    ```

## Local run
* In terminal #1
    ```sh
    $ cd adminEditorsEG
    $ tsc && ts-node index.ts
    ```
* In terminal #2
    ```sh
    $ cd adminzAdminEG
    $ tsc && ts-node index.ts
    ```

* In browser
    * http://0.0.0.0:8080 – admin app
    * http://0.0.0.0:9080 – editors app
    * In Chrome run extension to serve blog directory (which configured in `adminEditorsEG/config.yaml` configuration file)

## Server run

### Configure and mount s3 bucket
* set up s3 mounting software as described [here](https://github.com/MetaBake/MetaBake-Docs/blob/master/doc/_doc3/docs/ca.md#cloud-mount-s3)
* mount s3 bucket:    
    ```sh
    $ /root/goofys --profile default -o allow_other --use-content-type blog-app-project <PATH-TO-BLOG-DIR>
    ```

### Run node
```sh
$ sudo pkill node
$ cd adminEditorsEG
$ nohup tsc && ts-node index.ts &
$ cd adminzAdminEG
$ nohup tsc && ts-node index.ts &
```