
## Tutorial 2: Learn Pug and static binding; view via S3 HTTP server.

Simply said, Pug is HTML without closing tags. Pug is a templating language,  more powerful than Markdown. If you know of Node/Express, you know Pug already. 

If you know HTML, you mostly know Pug: just don't close the tags. Pug also has variables and imports (e.g. 'include fragment.pug').

We see Pug as a declarative 4th generation language (4GL). As we went from second generation assembly language (2GL) to higher level third generation (3GL such as C, C#, Java and JavaScript), our productivity jumped. Pug 4GL provides another huge productivity jump. 

1. Watch [this video](http://youtube.com/watch?v=wzAWI9h3q18) as an intro about Pug (it used to be called Jade).

2. Generate a sample app with

```
mbake -r
```

and copy the contents of the generated fireRO folder to the bucket you mapped in [Tutorial 1](/cloud1/), e.g. W:\\wgehner-fireRO.

3. Ensure that the sample app is fully built with

```
cd W:\wgehner-fireRO
mbake .
```

4. View the app in a browser. Use the S3 URL from [Tutorial 1](/cloud1/), e.g. https://s3.us-west-1.amazonaws.com

5. Edit index.pug, then `mbake .` and see the changed HTML in a browser.


## Working with text content

   include:marked text.md


## dat.yaml - part 1

dat.yaml is used to configure Pug per folder. Also for static binding, if you have "bla: Oh hi" in dat.yaml, you can statically bind inside a .pug file at compile time via:

      #{bla}

That will render 'Oh hi', the value of bla at compile time, in the HTML. This is especially useful for any SEO items.


#### Default Front End framework

The default front end framework used in most examples is Spectre CSS, but you can use any of the dozens out there. Spectre has relatively small size, AMP support and ease of use.

