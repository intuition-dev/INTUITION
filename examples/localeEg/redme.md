# How to localize

1. In the root of this example there is `loc.yaml` file that has the 'dictionary' with a list of languages:

```conf
# list of locales
loc:
- en
- ru
- de
```

This would be your default language or if there is no translation:

```conf
# default
key1: hello
```

And then you need to define each language and each key.
Each key should have a postfix whith the language (eg: `-ru` for Russian). Else it uses default:

```conf
key1-ru: Здравствуй
key1-de: 'Herzlich wilkommen'
```

Where `-ru` is for Russian, `-de` is for German

2. The page needs to say in `dat.yaml` where the loc.yaml is with the variable called `LOC`, inspect `/pg1/dat.yaml`:

```conf
LOC: ..
```

3. The pug will in scope have a variable `LOCALE` that says what locale is the page in. Eg: ru, or es, or en, or hr.
    So in `/pg1/index.pug` there is 'if' logic to display `.md` file according to the language of the page:

```html
if LOCALE === 'en'
    h1 Locale is 
        span.en
            | #{LOCALE}
        span    
            img(src='https://cdn-images-1.medium.com/max/2400/0*o0-6o1W1DKmI5LbX.png', alt="en", width='20px', height='10px')
    include:metaMD t-en.md

else if LOCALE === 'ru'
    h1 Locale is 
        span.ru
            | #{LOCALE}
        span    
            img(src='https://upload.wikimedia.org/wikipedia/en/archive/f/f3/20120812153730%21Flag_of_Russia.svg', alt="ru", width='20px', height='10px')
    include:metaMD t-ru.md
    
else if LOCALE === 'de'
    h1 Locale is 
        span.de
            | #{LOCALE}
        span    
            img(src='https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png', alt="de", width='20px', height='10px')
    include:metaMD t-de.md
``` 

4. When you the command:

```conf
$ mbake .
```
it will generate for each page an ./en, ./ru, ./de pages with the proper values, accordingly for all languages specified in the 'dictionary' in `loc.yaml`:

```conf
# list of locales
loc:
- en
- ru
- de
```

5. If some page needs a different layout by locale, create a `loc.pug` file in the locale page folder, eg: `/pg1/en/loc.pug`.
It will then ignore index.pug above and will use different layout just for `/en/` page from the file `/pg1/en/loc.pug`:

```conf
head

body
   p OK #{key1} 
      span    
         img(src='https://cdn-images-1.medium.com/max/2400/0*o0-6o1W1DKmI5LbX.png', alt="en", width='20px', height='10px')
   include:metaMD ../t-en.md
```

this option is very useful when in some language there is different word's length and you need to use different design for the words to fit into the page.

6. AMP is also localized if you have `m.pug` file for AMP in the page folder with `dat.yaml`, eg /pg1//m.pug:

```conf
head

body
   p mobile #{key1}
```