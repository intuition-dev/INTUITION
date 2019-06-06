
# SEO and social tags SEO

Since the web-app with MetaBake is statically generated it is great a SEO. Of course coming up with keywords for your landing pages is hard work and outside the scope of this documentation. 
And you should register any website or CMS with 'Google Webmasters search console': since it allows to
instantly check that the page SEO is working. Otherwise you are waiting for weeks to just change some code.
Make sure you submit the page you are working on to 'Google Webmasters search console' so you can see how the SEO sees it.

## Social SEO

And we help with social SEO, eg: If your dat.yaml is like this:

```yaml
title: MetaBake versus other Low-Code tools
image: slide-3.jpg
content_text: MetaBake is the open source extensible low-code productivity tool for programmers.
keywords: low-code, gulp, grunt, CMS, static gen
```

Then you can do social SEO like this - for example in your head.pug that you include in your pages or layouts:

```pug
   title #{title}
   meta(name='description', content=content_text)
   meta(name="google-site-verification", content="xyz")

   // Twitter Card data
   meta(name='twitter:card', content='summary_large_image')
   meta(name='twitter:title', content=title)
   meta(name='twitter:description', content=content_text)
   meta(name='twitter:image', content=image)

   // Open Graph data
   meta(property='og:title', content=title)
   meta(property='og:type', content='article')
   meta(property='og:image', content=image)
   meta(property='og:description', content=comment)
```

