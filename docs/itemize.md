
# CMS/Itemize example

### Itemize (eg CMS)

1. Lets build a folder called Items and in that folder create 
create a blank file dat_i.yaml, with nothing there.

2. In the folder called Items create folder Page1 and folder Page2.
In each page folder create index.pug and dat.yaml.
So you have Page1 and Page2 folder under items

3. In each Page's dat.yaml add 
```
title: Page name
```
And add a few more key/value words in each dat.yaml, but make each pages values a bit different.

4. And now, in the folder Items run
```sh
mbake -i .
```
It will create items.json.
This allows you to fetch that json; and search for content, CMS, items, etc.

### mbake -b will emit an example CMS with above.

The example CMS will also show you how the items.json is read to display a nice searchable and paginated 
list of items. No magic.

---