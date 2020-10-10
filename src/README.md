
# MetaBake ( Intuition v1 )

## 'All my friends KNOW the low-coder'

#### mbake CLI is open source and extensible low-code productivity bundler/builder that leverages Pug and JAMstack.

## Overview

MetaBake(mbake) provides a bundler/builder for a developer to write cleaner code quicker, with `pug` and livereload out of the box.

You can gradually adopt it while it allows you to develop quicker - and with clean simplicity - Static Websites, Custom Elements, custom CMS/E-Commerce, CRUD and all sorts of dynamic Web Apps.

#### Please star our main project here:
- https://github.com/INTUITION-dev/INTU

### Prerequisites

You should know HTML, CSS and JavaScript - that is all we use. If you need to catch up, we recommend this book: 'Design and Build Websites' by Jon Duckett.


## Quick start


```sh
   npm i -g mbake
   mbake -w . /* for a base website */
   cd website
   mbake -w . /* to run the watcher livereload */
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
Create file `style.yaml` in assets folder, to compile your scss to css

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
   style.yaml /* with `scss` files that need to be compiled */
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



```sh
mbake -f .
```

This emits a Pug file that you should include in your Pug's layout head section.
In turn, the included file calls a mbToolBelt.js from a CDN. 


## Apps

While you can build websites: you can also build full webapps, eg. CRUD.


**Other examples include:**

- Using markdown CSS effect: allows non-programmers to write interactive stories
- Slide show with markdown
- Dashboard example
- Ads example



# Links

[Advanced Front End w/ Pug](https://github.com/intuition-dev/mbCLI/tree/master/pug)

[mbake CLI Docs](http://intuition-dev.github.io/mbCLI)

[Git Repo](http://git.metabake.net)

[Pug example](http://pug.metabake.net)

[INTUITION.DEV Home Page](https://www.INTUITION.DEV)