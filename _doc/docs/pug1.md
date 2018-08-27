
## Tutorial 2: Learn Pug and static binding; view via S3 HTTP server.

Simply said, Pug is HTML without closing tags. Pug is a templating language,  more powerful than Markdown. If you know Node/Express, you know Pug already. 

If you know HTML, you mostly know Pug: just don't close the tags. Pug also has variables (e.g. `#{key1}`) and imports (e.g. `include fragment.pug`).

This Pug:
```
header
body
   p Hello #{key1}
```

with `key1:World` (from `dat.yaml` in our case)
becomes this HTML:

```
<header></header>
<body>
   <p> Hello World</p>
</body>
```
Pug is more concise, more powerful and easier to read and write than HTML. Unlike Markdown, it also retains all capabilities of HTML.

We see Pug as a declarative 4th generation language (4GL). As we went from second generation assembly language (2GL) to higher level third generation (3GL, like C, C#, Java and JavaScript), our productivity jumped. Pug 4GL provides another huge productivity jump. 

### Steps

1. Watch [this video](http://youtube.com/watch?v=wzAWI9h3q18) as an intro about Pug (it used to be called Jade).

2. Generate a sample app with

      ```
      mbake -r
      ```
      and copy the contents of the generated `fire-ro` folder to the bucket you mapped in [Tutorial 1](/cloud1/), e.g. `W:\wgehner-fire-ro`.

3. In the Amazon SE browser, go to the `/assets/css folder`, check all CSS files, select "More - change metadata", and set `Content-type` to `text/css`.

4. View the app in a browser. Use the S3 URL from [Tutorial 1](/cloud1/), e.g. `https://s3.us-west-1.amazonaws.com`

5. In `dat.yaml` change 'Oh hi!' to 'Boho!', save, then `'mbake .'` and see the changed HTML in a browser. You could also change something in `index.pug`.

## About dat.yaml
mbake looks for `dat.yaml` in each folder and uses it for static binding. If you have `bla: Oh hi` in `dat.yaml`, you can use the value inside a `.pug` file at compile time via:

      #{bla}

That will put`'Oh hi'`, the value of `bla` at compile time, into the HTML. This is especially useful for any SEO items that can be repetitive in the HTML source.


## Working with text content

   include:marked text.md


## Default front end framework

The default front end framework used in most examples is Spectre CSS, but you can use any of the dozens out there. Spectre is relatively small (in KB), easy to use and supports AMP.

