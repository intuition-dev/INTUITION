# SASS

CSS can be hard to work with so people use Sass/Scss. Create a ex.sass file:
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
It will create a css file with auto-prefixes.


### More on Sass 
In general you should leverage a CSS framework, there are many to chose from. 

For font, we default to Open Sans, but like a CSS framework, you can use any.

Also, as mentioned before INTUITION  Markdown supports css classes. 