
## Pug I: Learn Pug and static binding; view via S3 HTTP server.

Simply said, Pug is HTML without closing tags. Pug is more powerful than Markdown. If you know of Node/Express, you know Pug already.

- [Pug on Youtube](http://youtube.com/watch?v=wzAWI9h3q18)

Pug also has variables and import.

As we went from second generation (2GL) to third (3GL), our productivity jumped. We view Pug as declarative (*_MetaBake_ pillar 4) 4th generation language. It helps achieve a huge productivity jump. We position Pug as 4GL.

To learn, edit a Pug in the mbake CRUDA sample project, 'mbake .' and see the changed HTML in a browser (e.g. via prior S3 step).


## dat.yaml - part 1

dat.yaml is used to configure Pug per folder. Also for static binding, if you have "bla: Oh hi" in dat.yaml, you can statically bind inside a .pug file at compile time via:

      #{bla}

That will render 'Oh hi', the value of bla at compile time, in the HTML. This is especially useful for any SEO items.


#### Default Front End framework

The default Front End (FE) Framework used in most examples is Bulma - due to its relatively small size and ease of use.
NOTE: Bulma CSS has been customized to remove things not needed. For example, it uses [kumailht/gridforms](http://github.com/kumailht/gridforms). You can look at the FE Frameworks Bulma folder to see SASS modules commented out.

