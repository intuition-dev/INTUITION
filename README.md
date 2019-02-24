<img src="https://metabake.github.io/MetaBake-Docs/logo.jpg" width="100">

### MetaBake is the extensible open source LOW-CODE productivity tool for programmers; including dynamic apps and data binding.

#### MetaBake works via static generation; with Pug, Markdown and more; including dynamic apps and data binding. We aim to grow the popularity of low-code. *'All My Friends Know a low-coder.'*

MetaBake mbake CLI lets you generate websites and dynamic webapps in Pug by leveraging LOW-CODE pillars for high development productivity.

## Install

Easy to install

```sh
yarn global add mbake
mbake
```

Install note:
- If you get an error like 'Node Sass could not find a binding for your current environment' 
run$: ``` yarn global upgrade ```

## First Page

Create file index.pug
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

Of course you can use regular Pug syntax to include other Pug files; or Markdown. MetaBake markdown flavor includes CSS support:
```pug
    include:metaMD comment.md
```

## More

There are many example apps, and shipped templates include include: an CMS module, a watcher, SPA, Blog, Website, Slides, Dashboard, CRUD, PWA, Electron, Hybrid mobile apps, server-less via AWS | GCP FireStore, RIOTjs, Ads and more. 


MetaBake supports CSS classes in Markdown, plus, because it uses Pug - it can also do any HTML layout. But MetaBake is not static only - it fully supports and has examples, shipped apps, and docs for dynamic and even mobile apps.


Primary focus is high development productivity (via "low-code") and being easy to adopt. It is also fully flexible to build any WebApp in any directory tree structure you like; anc use any CSS/SASS framework you like. Of course it is server-less, and it uses AWS S3 or GCP FireStore.


- Click for mBake Docs: [docs.mBake.org](http://docs.mBake.org)
- [git.mBake.org](http://git.mBake.org)
- Community [forum.mBake.org](http://forum.mBake.org)
- Check for the latest version of mBake: [npm.js](https://www.npmjs.com/package/mbake)
