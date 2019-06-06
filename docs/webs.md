
## Examples - Website

There are 12 very different examples included in the mbake CLI. One is just a website:

```sh
  mbake -w
```
That will extract an example website in the current folder. ( Obviously you can create any layout with any combination of css and other libraries, but here is how we laid out an example/starter website). 

---
It has a README.md in root of the website.

### depp.min.js

Most example web-apps, including the website, need to load external .js libraries. 
MetaBake example the use the CDN centric .js loader 'depp': http://github.com/muicss/johnnydepp but you can use any 'loader' lib you like. But learn the default depp.js, since all the examples us that one:

```javascript
// define dependencies
depp.define({
  'jquery': ['/path/to/jquery.js'],
  'plugin1': ['#jquery', '/path/to/plugin1.js', '/path/to/plugin1.css', '/path/to/plugin1.png'],
  'plugin2': ['#jquery', '/path/to/plugin2.js', '/path/to/plugin2.css', '/path/to/plugin2.png']
})

// load dependencies
depp.require(['plugin1', 'plugin2'], function() {
  /* plugin1 and plugin2 are ready to be used */
})
```


You'll find the real loading code in /assets/js/loader.js. 

 You should review the standard layout of folders:
 - /layouts has the main Pug layouts that each page extends.
 - /landing/* has the website pages, the index.pug and dat.yaml. To navigate to a webpage is a 'a href' to the 
 /landing/page1 or landing/page2.
 - /assets/assets.yaml to process the Sass into css

There are many navigation libraries on github - a way to create a navbar, and we leverage one in here.  In advanced docs we review some nav libs, but not here.

And as mentioned at the start: there are 12 example of very different web-apps, you should study a few to see how we chose to layout things so you get your own ideas.

---

(Notice there is also a loader.min.js. mbake -t created the min file, even when .ts is not found it semi minimizes .js. 
It does not do a full min so that in production we can have reasonable error messages about our code. )

