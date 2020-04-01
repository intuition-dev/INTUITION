## Hexo Theme
A minimalist theme for [Hexo](http://hexo.io)
This theme is written with [Pug](http://pugjs.org)

## Installation

#### Install
```
npm install --save hexo-renderer-pug hexo-generator-feed hexo-generator-sitemap
git clone https://github.com/farnaziifz/hexo-hive.git
```
## Enable
Modify `theme` setting in `_config.yml` to `hexo-hive`
You can override the theme options using main `_config.yml`

```
theme: hexo-hive
menu:
  - page: home
    directory: /
  - page: archive
    directory: /archives/
  - page: rss
    directory: /atom.xml

footer:
  - item: contact-us
    directory: /contact-us
  - item: about-us
    directory: /about-us
```

## Update
```
cd themes/hexo-hive
git pull
```
### Requirment
test with the latest version of the following:

|library| Min.Version|
|---|---|
|[Hexo](https://hexo.io/) | 3.8.x |
|[Sass](http://sass-lang.com/) | 3.7.x |
|[Pug](https://pugjs.org) | 2.0.x |

## License
MIT