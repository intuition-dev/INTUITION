
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

---
(of course you have to load any polyfills like
promises, fetch or what you need)

And normally you run that command at the root of your Web App; but don't use it for back-end node.js.
