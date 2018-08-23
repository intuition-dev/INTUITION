
## Pug I: Learn Pug and static binding; view via S3 HTTP server.

Simply said, Pug is HTML without closing tags. Pug is a templating language,  more powerful than Markdown. If you know of Node/Express, you know Pug already. If you know HTML, you know Pug: just don't close the tags.

- [Pug on Youtube](http://youtube.com/watch?v=wzAWI9h3q18)

Pug also has variables and import, called include.

As we went from second generation (2GL) to third (3GL), our productivity jumped. We view Pug as declarative (*_Metabake_ pillar 4) 4th generation language. It helps achieve a huge productivity jump. We position Pug as 4GL.

To learn, edit a Pug in the mbake CRUDA sample project, 'mbake .' and see the changed HTML in a browser (e.g. via prior S3 step).


## Working with text content

   include:marked text.md


## dat.yaml - part 1

dat.yaml is used to configure Pug per folder. Also for static binding, if you have "bla: Oh hi" in dat.yaml, you can statically bind inside a .pug file at compile time via:

      #{bla}

That will render 'Oh hi', the value of bla at compile time, in the HTML. This is especially useful for any SEO items.


#### Default Front End framework

The default front end framework used in most examples is Spectre CSS, but you can use any of the dozens out there. Spectre has relatively small size, AMP support and ease of use.

