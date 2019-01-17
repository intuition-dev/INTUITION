The <yield> tag is a special riot core feature that allows you to inject and compile the content of any custom tag inside its template in runtime.

In this example `html` which is passed to a `tag` from `index.pug` specified under the `boa-tag` tag (the `form`):

```html
boa-tag
    form
        input(type='number', placeholder='Enter any number', id='one')
        input(type='number', placeholder='Enter any number', id='two')
        button(type='submit') Check sum!
```

And this `html` in compiled output will be inserted exactly in the place where the `<yield/>` tag is specified:

```html
    boa-tag

        p A simple example of calculating. The form below is passed inside a tag using Yield feature
        p.num { num }

        <yield />
```