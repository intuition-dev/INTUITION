# What is mbake?

mbake is a modern CLI static app generation tool. Apps and sites you generate with mbake are extreme serverless, allow user authentication and work with JSON and database APIs for dynamic databinding. You can use mbake for simple blogs or sites to the most complex web and mobile app projects.

If you don't have time, see [tl;dr](#tldr) at the bottom of this page.

mbake compares to other static generators and grunt/gulp; but it does a lot more with a lot less coding.

mbake is part of the Metabake&trade; approach but can be used by itself.

## What is Metabake?

Metabake&trade; is a modern development approach that helps you deliver web apps 10X faster with less coding. Metabake&trade; has 10 pillars.

Find out more about Metabake:

- [Quick Demo](https://youtu.be/WyCdSFTUIvM)

- <a href='https://vimeo.com/282034037' target='_blank'>Meetup Video</a>

- [Slide Deck](http://prez.metabake.org/p)

- [Summary for Managers](https://www.youtube.com/watch?v=OK-cJNSkQII)

Metabake allows for gradual adoption. You can start by adopting just one or a few of its pillars. mbake is a good start.

Metabake and mbake are open source. The source code is available at [github.com/metabake](https://github.com/metabake)

See [Resources](/mbake/res/) for related projects.

## How to install mbake

From a command line such as Powershell, type:

```
   npm -g i mbake
```

That's it! If you don't have Node with NPM installed, first go [here for Windows](https://nodejs.org/en/download/) or [here for MAC](http://blog.teamtreehouse.com/install-node-js-npm-mac).

## How to create a Hello World app with mbake

```
## Create index.pug
   header
   body
      p Hello #{key1}

## Create dat.yaml
   key1: World

## Generate index.html from Pug and Yaml:
   mbake .

   or: mbake subfoldername
```

If you install the Metabake META server (see META doc), you don't even have to do the 'mbake .'. META has a watcher that triggers 'mbake' when you save a file.

## How to run an mbake app (such as Hello World)

mbake apps run on any static web server. This includes low-cost cloud hosting such as Amazon S3. We show how to work with S3 later in this doc.

When you develop locally, you could use 'Web Server for Chrome' to run mbake apps. To install it, open your Google Chrome web browser and install the 'Web Server for Chrome' app from [here](https://chrome.google.com/webstore/search/Web%20Server?_category=apps). Launch the app, click the 'Choose Folder' button and select the root folder of your app (e.g. where index.html of your Hello World app is). Also ensure 'Options' has 'Automatically show index.html' checked. Ensure the Web Server is STARTED, then navigate to the proposed URL (e.g. http://127.0.0.1:8887).

Even though mbake apps are installed on a static server, they are dynamic because they allow user authentication and work with JSON for dynamic rendering and and database APIs for dynamic databinding.

## How to generate a sample app with mbake

```
## Run mbake help to see the list of current sample apps
   mbake

## Generate sample app, e.g.
   mbake -r

## Navigate to it, e.g.
   cd fireRO
```

## Other popular mbake commands

* `mbake -t .` - Convert Pug/Riot files to useable tag/js, e.g.: data binding.
* `mbake -i .` - Convert dat.yaml static files to JSON, for dynamic binding. More about this in B-M-SPA docs.

## How to see all mbake options

```
   mbake
```

## How to make mbake apps serverless

To go extreme serverless, we show how to use mbake with
- Amazon Web Services (AWS) S3 HTTP hosting
- Mounting software Webdrive so you can mount AWS S3 as a drive
- Google Firebase/Firestore

### Go extreme serverless in four steps (Tutorials):

- [Tutorial 1](/mbake/cloud1/): Setup S3 as your cloud server and mount it.
- [Tutorial 2](/mbake/pug1/): Learn Pug and static binding; view via S3 HTTP server.
- [Tutorial 3](/mbake/pug2/): Read dynamic data from Firestore and bind via Pug.
- [Tutorial 4](/mbake/cloud2/): Apply authentication and write dynamic data.

When done, you should see [this](https://youtu.be/-KkPfAnEXyk).

Serverless/Cloud V2, Mount and Pug are some of the pillars of Metabake.

## tl;dr

```
   npm -g i mbake
   mbake
   mbake -r
   cd fireRO
   mbake .
```


