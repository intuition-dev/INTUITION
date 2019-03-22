# Get started

MetaBake is the extensible low-code productivity tool that simplifies the process for building great software.

MetaBake mbake CLI lets you generate websites and dynamic webapps in Pug by leveraging low-code pillars for high development productivity.

## Install

Easy to install

```sh
$ yarn global add mbake
$ mbake
```

## First Page

Create file index.pug

```html
header
body
   p Hello #{key1}
```

and create file dat.yaml

```js
key1: World
```

now make with mbake

```sh
$ mbake .
```

This will create index.html.

Of course you can use regular Pug syntax to include other Pug files; or Markdown. MetaBake Markdown flavor includes CSS support:

```html
include:metaMD comment.md
```

## Examples

You can check examples by doing command:

```sh
$ mbake
```
and

```sh
$ mbakeX
```

This will output available commands for downloading starter applications.

For example, this command will download the website template:

```sh
$ mbake -s
```

Examples include an admin module, a watcher module, SPA, Blog, Website, Slides, Dashboard, CRUD, PWA, Electron, Hybrid mobile apps, Cloud v2.0 via AWS|FireStore, RIOTjs and more.

Primary focus is high development productivity (via "low-code") and being easy to learn. But it is also fully flexible to build any web-app in any directory tree structure you like and use any CSS/SASS framework you like. MetaBake supports CSS classes in Markdown, plus, because it uses Pug - it can also do any HTML layout. But MetaBake is not static only - it fully supports and has examples and docs for dynamic applications.