# API documentaion

1. To generate human readable documentation install npm documentation globally (`-g`):

```conf
$ npm -g i documentation
```
2. In the folder `/wwwAdmin/assets/js` there should be `documentation.yml` file.
    Do command from this folder:

```conf
$ documentation build --config documentation.yml adminWebAdmin.js -f html -o api
```

It will generate `api` folder with the human readable documentation, which can be accessible by the url in browser:

[your-ip]:8080/assets/js/api/index.html