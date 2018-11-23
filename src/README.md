
Docs, examples and more at:

[Metabake.net](http://www.metabake.net)

License of all examples apps are MIT - but core build lib itself(Base.*) is LGPL.

You can use for free in any way; but if you change or use the core library directly, you must contribute back to the source of the ideas.



- [Click for 'THE' mbake Docs](http://doc.metabake.net/mbake/)

10 times more productive web app development via low code such as Pug

Metabake mbake CLI lets you generate websites and dynamic webapps in Pug by leveraging low code pillars for high development productivity.

## Install

Easy to install

```sh
yarn global add mbake
mbake
```

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

### Now make with mbake

```sh
mbake .
```

This will create index.html. Of course you can use regular Pug syntax to include markdown with CSS support:
```pug
    include:metaMDtf comment.md
```

## Home Page

There is also an admin module, a watcher module, Hybrid mobile apps, SPA, Blog, Website, CRUD, PWA, Electron, Cloud v2.0 via AWS|FireStore, RIOTjs and more. 
Primary focus is high development productivity (via "low code") and being easy to learn. But it is also fully flexibile to build any webapp in any directory tree structure you like an use any CSS/SASS framework you like.
Metabake supports CSS classes in markdown, plus, because it uses Pug - it can also do any HTML layout. But metabake is not static only - it fully supports and has examples and docs for dynamic apps.

[Metabake.net](http://www.metabake.net)