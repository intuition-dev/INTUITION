<img src="https://metabake.github.io/MetaBake-Docs/logo.jpg" width="100">

### MetaBake&trade; is the extensible open source low-code productivity tool for programmers; including dynamic apps and data binding. 'All my friends KNOW a low-coder'

MetaBake&trade; mbake CLI lets you generate websites and dynamic webapps in Pug by leveraging low-code pillars for high developer productivity.

## Install

```sh
yarn global add mbake
mbake
```

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

Of course you can use regular Pug syntax to include other Pug files; or Markdown. (MetaBake&trade; markdown flavor includes CSS support):
```pug
    body
        div
            include:metaMD comment.md
```
So if you write a markdown file comment.md; it will be included in index.html

## SASS

Create a ex.sass file 
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
It will create a css file with auto-prefixes


## TypeScript

If you write a ts file, like foo.ts:
```ts
foo(i:nubmer) {
    console.log('oh hi')
}
```
and run
```sh
mbake -t .
```
It will create a .js and min.js files.

## Itemize (eg Blog)
So far you created all files in folder called one. Now lets create a file above folder one.
1. So above your folder that has index.pug and dat.yaml, create a a blank file dat_i.yaml, with nothing there.

2. And copy the folder one, as folder two. So you have two folders, one and two - each with dat.yaml; and above them dat_i.yaml!

3. Edit two/dat.yaml to say key1: World2 
instead of key1: World

4. And now, in the folder above one/ and two/ run:
```sh
mbake -i .
```
It will create items.json.
This allows you to fetch that json; and search for content, blog, items, etc.

This is the basics and intro to MetaBake&trade;. You can see it helps with html, .js, .css, and json. You can use these basic features to help you write any web-app.

## To learn more:

There are many example apps, and shipped templates include: an CMS module, a watcher, SPA, Blog, Website, Slides, Dashboard, CRUD, PWA, AMP, Electron, Hybrid mobile apps, server-less via AWS | GCP FireStore, RIOTjs, Ads and more. 

MetaBake&trade; is not static only - it fully supports and has examples, shipped apps, and docs for dynamic and mobile apps; using single code base.

- Click for mBake Docs: [docs.mBake.org](http://docs.mBake.org)
- [git.mBake.org](http://git.mBake.org)
- Community [forum.mBake.org](http://forum.mBake.org)
- Check for the latest version of mBake: [npm.js](https://www.npmjs.com/package/mbake)
