## Advanced Front End Development with JAMStack that leverage ExpressJS's built in *Pug* markup; plus hands on examples
### Markdown

If you use Github, you know README.md markdown. I use Marker editor http://fabiocolacio.github.io/Marker, it is one of my favorite tools. Also, everyone (and every project) should use Github pages. 

#### Required Lab 1: 
If you are not familiar with github pages, then set that up now before proceeding. One easy way is with http://docsify.js.org. This way you practice markdown.

Ex. Github pages, source for _sidebar.md:

```
   * [Home Page](README.md)
   * [Page1](pg1.md)
   * [Page2](pg2.md)
```

Now create those 3 files, and use the index.html file that you get from Docsify's website.

Above helps you learn markdown, before we get into markup and static generation. 

Aside: You can do charts and slides in markdown.

### SASS to CSS

CSS is the most important and most powerful tool for Front End Developers/Designers. But we no longer write CSS by hand, we now generate CSS from SASS (or Scss) files. We likely download a SASS(or Scss) library from WWW (eg: http://github.com/owenversteeg/min/tree/gh-pages/sass ), edit the SASS files and generate CSS files.
To generate the CSS, we can use Grunt, Gulp, PrePros.IO or write a new shell command via a script in node.js. 

If you have never generated CSS, install the free http://www.PrePros.IO and try it. 

# Quick Intro to Pug:

You have heard of NodeJS, and even NodesJS http server: ExpressJS. A *rendering engine used by ExpressJS template engine is **Pug**!:
- [ExpressJS Pug](http://expressjs.com/en/guide/using-template-engines.html)

And here is what Pug looks like, click around a bit: 
- http://html2pug.now.sh

But Pug is also used with *all* the other popular tech stacks, for example [Laravel Pug](http://github.com/BKWLD/laravel-pug), and others as well.

Alternatives/similar to Pug include Haml and Ebay's MarkoJS concise syntax.

## mbake CLI
---

You can use Grunt, Gulp, Prepros.IO or write a script in node.js to convert Pug to HTML. The later is most flexible, I wrote a script to convert Pug to HTML, and I named that command mbake. We will use *mbake* CLI to generate html from the Pug language: 

- [mbake CLI](http://www.npmjs.com/package/mbake)

You can install that if you want to follow along.

#### Optional Lab 2:
Install http://www.npmjs.com/package/mbake

Then you should extract a the example we will use by running ```mbake --pug```, and then ```cd pugIntro```.

Just from fun run ```mbake -s .``` in that folder.

That converts SASS/SCSS files and makes .css.

But we are here for Pug, run ```mbake .``, and it will make html file from the Pug file!

*Now you know how to statically generate html from markup!*

# Using Pug with static data from yaml

(if you don't know yaml, think of it as JSON).

Notice that there is a dat.yaml file tehre. The mbake CLI has code that extends the standard Pug compiler to provide the data in the yaml file statically
at compile time.

For example if the Pug file has:
``` 
    p Hello #{key1}
```
and dat.yaml has
```
    key1: World
```
and you run ```mbake . ``` you will get the expect result :-).

This makes it easier for example to do any SEO, where things like  #{title} is repetitive code.
Done!

Note there is one *on purpose* limitation in mbake CLI: it must start w/ index.pug (and must have dat.yaml). You can of course still
use include and extends (include and extends are Pug keywords) as you wish.
So to make a new page/screen you must create a new folder. This helps organize the code and the hyperlinks.

And since it is static: you can serve from the edge via a CDN (my CDN supports http3/QUIC/udp) for a lower cost and higher performance.


## Dynamic Data Binding

Above was all statically generated data, great for SEO.
For dynamic you would write fetch .js code to get the dynamic results. And here is one example of how to do dynamic binding, in this case using MustacheJS:

```
   template#card
      span {{#.}}
         .txtCont
            h4 {{title}}
            p {{desc}}
      span {{/.}}
```

Above is Pug code to create a MustacheJS template, that you can then render via with your data. You can use any dynamic data binding you like with JAMStack.


# Extending DOM tags w/ Custom Elements 

Html and Pug have elements like div, article, etc. that Pug and browsers know. We can create additional
custom elements using native api of a browser: no need to download any .js library.

Here is an example of defining a custom element 'c-custel':

```
   var cTemp = document.createElement('template')
   cTemp.innerHTML = `
      <b>I'm Comp DOM!</b>
      <slot></slot>
   `
   customElements.define('c-custel', class extends HTMLElement {
      sr 
      constructor() {
         super()
         this.sr = this.attachShadow({mode: 'closed'})
         this.sr.appendChild(cTemp.content.cloneNode(true))
      }//cons
   })
```

And now you can use 'c-custel' like any other tag in Pug!
You can continue to a full Custom Element tutorial here:

- http://custel1.metabake.net

With the custom elements you can add more attributes, functionality, events, etc. because it is all standard.
It is important to write custom elements for the purpose of more DOM and less .js. 

Also, sometimes a custom element has dynamic data binding inside of it. 

## Advanced: Leveraging Pug for cross-platform development.

You can statically generate any kind of a web app, PWA, or if you make an SPA app you can have the same app run not only as
a web app, but same code can run Electron. JAMStack is just HTML, css and .js.

#### Recommended Lab 3: 

1. Write a Pug page that does a fetch from a public API and dynamically binds data.
2. Write an Electron app around above Pug page.

---

#### Cross platform development continued:

 You can also use Cordova or PhoneGap: to make Android or IOS app.  I use http://build.PhoneGap.com so there is no Android, IOS, or Cordova to install. It is all done in the cloud.

Here is an example cross platform app: (http://github.com/INTUITION-dev/mbMobile), for 3 platforms. Notice that the web app, electron app and phonegap app all use a symbolic link to the same directory: **same code base**. We won't spend more time on this, you can look at the code but just a point is: you can make a cross platform app in Pug.


# Future and Low-code

## MAVO
One example of DOM-centric, eschew imperative ECMAScript is http://MAVO.io.

Here is an example of MAVO w/ Pug:

```
   head      
      script(src='http://get.mavo.io/mavo.js')
      link(rel='stylesheet' href='http://get.mavo.io/mavo.css')

   body
      div(mv-app='mavoTest' mv-storage='local') My first Mavo app!
```
(full example is here: http://github.com/intuition-dev/mbCLI/tree/master/more_examples/mavo ) 

### Low Code

In the future, Low-Code tools will further increase productivity. You can use a search engine to find low code tools, one of them is my own http://www.intuition.DEV. Basically the idea is to allow regular users and developers maintain Web Applications. 

## Summary

You can start by using markdown, and then learn how to generate web apps using markup. Some can go further and extend the markup DOM or even do cross-platform development.

# Other

A back end basics article by the author:
- http://medium.com/@cekvneich/short-review-of-basics-of-full-stack-big-data-scalability-and-clusters-of-distributed-data-bcc8e3a8abd3

#### Hiring

A good place to find developers that will be successful as advanced front end developers is Dribble. 
If your candidate is eager for imperative programming, they may be a better fit for full-stack/back end role. Wile front end development roles are demanding, one nice things is that they are suitable for remote or work from home resources.


