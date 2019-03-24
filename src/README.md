
# About MetaBake&trade;

<img src="http://metabake.github.io/MetaBake-Docs/logo.jpg" width="100">

### MetaBake&trade; is the extensible open source low-code productivity tool for programmers; including dynamic apps and data binding. 'All my friends KNOW a low-coder'

MetaBake&trade; mbake CLI tool is a modern way to generate websites and dynamic webapps via low-code to help you achieve high developer productivity, without additional effort. MetaBake&trade; open source tool helps you deliver web apps 10X faster with less coding by leveraging our documented high-productivity approaches/pillars. MetaBake&trade; is a simple tool, but can build any type of an app or website, and it allows for gradual adoption. You can start by slowly adopting just a few of its approaches. 

Prerequisites: you should know HTML, CSS an .js - that is all we use. If you need to catch up, we recommend this book: 'Design and Build Websites' by Jon Duckett. You should also learn Pug, to get started on Pug, watch [Pug (aka Jade) on Youtube](http://youtube.com/watch?v=wzAWI9h3q18)

Best way to get started with mbake is to read and practice the docs full at http://docs.mbake.org. But here is a taste:


## Install

```sh
yarn global add mbake
mbake
```

# MetaBake&trade; first 2 Minutes:

## First Page

Create a folder called 'one'.
In the folder 'one', create file index.pug
```pug
header
body
    p Hello #{key1}
```
and create file dat.yaml
```yaml
key1: World
```

### Now make with mbake:

```sh
mbake .
```

This will create index.html. 

Of course you can use regular Pug syntax to include other Pug files; or Markdown. (MetaBake&trade; Markdown flavor includes CSS support):
```pug
    body
        div
            include:metaMD comment.md
```

And example Markdown file with CSS style
```
  # header {.style-me}
  I think this is good.
```

So if you write a Markdown file comment.md; it will be included in index.html

---

## Watcher

This will start a webserver and auto-refresh browser, and watch for file changes to auto build:

```sh
  mbakeX -w .
```

Instead of . you can specify any path.
Also, the fact that we are generating this static content allows us to have the entire webapp served by a CDN. 

---

## SASS

CSS can be hard to work with so people use Sass/Scss. Create a ex.sass file:
```css
$font-stack:    Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

Create a files assets.yaml 
```
css:
- ex.sass
```

and run
```sh
mbake -s .
```
It will create a css file with auto-prefixes.


## TypeScript

TypeScript is supper-set of JavaScript. Write a ts file, like foo.ts:
```ts
foo(i:number) {
    console.log('oh hi')
}
```
and run
```sh
mbake -t .
```
It will create a .js and min.js files. It will output ES5 to support IE11, so feel free to use class { } syntax. 
If there is no .ts, than it will simply slightly mimifify js files into min.js (but no ES5 conversion).

----

## Examples - Website

There are 12 very different examples included in the mbake CLI. One is just a website:

```sh
  mbake -w
```
That will extract an example website in the current folder. ( Obviously you can create any layout with any combination of css and other libraries, but here is how we laid out an example/starter website). 

---

## To learn more:

There are many example apps, and shipped templates include: an CMS module, a watcher, SPA, Blog, Website, Slides, Dashboard, CRUD, PWA, AMP, Electron, Hybrid mobile apps, server-less via AWS | GCP FireStore, RIOTjs, Ads and more. 

MetaBake&trade; is not static only - it fully supports and has examples, shipped apps, and docs for dynamic and mobile apps; using single code base.

- Click for mbake Docs: [docs.mbake.org](http://docs.mbake.org)
- [git.mbake.org](http://git.mbake.org)
- Community [forum.mbake.org](http://forum.mbake.org)
- Check for the latest version of mbake: [npm.js](http://npmjs.com/package/mbake)
