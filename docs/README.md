
# mbake  CLI

## 'All my friends KNOW the low-coder'

#### INTUITION  is open source and extensible low-code productivity bundler/builder for front-end developers.

## Overview

MetaBake(mbake) provides a bundler/builder for a developer to write cleaner code quicker, with `pug` and livereload out of the box.

You can gradually adopt it while it allows you to develop quicker - and with clean simplicity - Static Websites, Custom Elements, custom CMS/E-Commerce, CRUD and all sorts of dynamic Web Apps.

### Prerequisites

You should know HTML, CSS and JavaScript - that is all we use. If you need to catch up, we recommend this book: 'Design and Build Websites' by Jon Duckett.


## Quick start

Note: Some of the upstream packages we user are native, so you need to : apt-get install build-essential or similar to get the platfrom C compiler. https://github.com/npm/cli/issues/287

```sh
   apt-get install build-essential
   npm i -g npm@next
   
   
   npm i -g --unsafe-perm=true --allow-root mbake
   mbake -w . /* for a base website */
```


## INTUITION  in 4 Minutes

Building sites take a few moments, just add `index.pug` and `dat.yaml` files in the folder, and compile it with `mbake .` from the root folder of your site.


### Example
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
> Note: to create a new page|screen in mbake, create a new folder with an index.pug and day.yaml in each folder.


### Now make with mbake:

```sh
mbake .
```

This will create `index.html`. Of course you can use regular Pug syntax to include other Pug files or Markdown. (INTUITION Markdown flavor includes CSS support):
```pug
body
   div
      include:metaMD comment.md
```

And example Markdown file with CSS nested classes. Title is nested in 2 levels, .column class CSS and second level .stick CSS class
```
:::: column col-2
::: stick
Title 
:::
::::

```



So if you write a Markdown file comment.md, it will be included in index.html
---


### Watcher

This will start a webserver and auto-refresh browser, and watch for file changes to auto build:
```sh
mbakeX -w .
```

Instead of `.` you can specify any path.
Also, the fact that we are generating this static content allows us to have the entire Web App served by a CDN


## SASS
CSS can be hard to work with, so people use Sass/Scss. Create a `style.scss` file:
```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
   font: 100% $font-stack;
   color: $primary-color;
}
```
Create file `assets.yaml` in assets folder, to compile your scss to css

```
css:
- style.scss
```

and run
```sh
mbake -s .
```

It will create a css file in `assets/css` with auto-prefixes.

So the structure of asset folder should look something like that:
```folder
assets/
   css/style.css /* this is going to be compiled from style.scss */
   scss/style.scss /* your working area */
   assets.yaml /* with `scss` files that need to be compiled */
	...
```

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

Lots of time you use .ts to call DB services: such as Google FireStore.

## Examples - Website

There are 12 very different examples included in the mbake CLI. One is just a website:
```sh
mbake -w
```

That will extract an example website in the current folder. ( Obviously you can create any layout with any combination of css and other libraries, but here is how we laid out an example/starter website).



## CMS/Itemize example

### Itemize (eg CMS)

Lets build a folder called `Items` and in that folder create a blank file `dat_i.yaml,` with nothing there.
- In the folder called `Items` create folder `Page1` and folder `Page2`. In each page folder create `index.pug` and `dat.yaml`. So you have `Page1` and `Page2` folder under `Items`.

- In each Page's `dat.yaml` add
```
title: Page name
```
And add a few more key/value words in each dat.yaml, but make each pages values a bit different.

- And now, in the folder `Items` run

```sh
mbake -i .
```
It will create `items.json`. This allows you to fetch that json and search for content, CMS, items, etc.

## INTUITION  FrameWork(FW)/Application Architecture(AA)

There is not much to ours. 

```sh
mbake -f .
```

This emits a Pug file that you should include in your Pug's layout head section.
In turn, the included file calls a 'setup-deffs' js file that defines and show you how to define things you can require later.


## Next steps

Now that you know mbake foundation, here are some choices for next things to learn in the advanced docs, pick and chose:

- CMS: an admin panel that you can host to can use as is; or as a base to build commercial grade CMS or eCommerce site, including browser plugin.
- MetaCake: plugin components, makes it easy for designers to write real Web Apps. Developed with RIOTjs, easier than Reactjs (commercial license optional)
- AMP
- SPA router: with page transition effects and state machine (needed for cross-platform development)
- Cross platform development with real single code base development: single code base for Web, AMP, Electron and Capacitor (by Ionic)

- VS code from the Cloud: multiple developers using a browser against same VS Code host in the cloud

**Other examples include:**

- Using markdown CSS effect: allows non-programmers to write interactive stories
- Slide show with markdown
- Dashboard example
- Ads example


# Links

- Full Docs: [docs.INTUITION.DEV](http://docs.INTUITION.DEV)
- [INTUITION.DEV](https://www.INTUITION.DEV)
- [blog.MetaBake.net](http://blog.MetaBake.net)
- [Github](http://git.INTUITION.DEV)
- Check for the latest version of mbake: [npm.js](http://npmjs.com/package/mbake)
