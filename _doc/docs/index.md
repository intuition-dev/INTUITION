# mbake

Low-code + Low-tech = 10X faster web app development.

With Metabake's modern development approach, it is not about replacing your tech stack with another tech stack -- it is about eliminating it!


## Metabake  overview

To get an overview of Metabake pillars:

- [Metabake Quick Demo](https://youtu.be/WyCdSFTUIvM)

- <a href='https://vimeo.com/282034037' target='_blank'>Meetup Video</a>

- [Metabake Full Slides](http://prez.metabake.org/p)

- [Metabake Sales Summary](https://www.youtube.com/watch?v=OK-cJNSkQII)

&nbsp;
- <a href='http://chat.metabake.org' target='_blank'>Forum/Chat</a>, to support this project, please join!


Directory of related projects is in Resources on left, and source code is here:
- <a href='http://git.metabake.org' target='_blank'>git.metabake.org</a>

### mbake install

```
   npm -g i mbake
   mbake
   mbake -c
   cd CRUDA
   mbake .
   // Start a dev HTTP server, e.g.: 'Web Server for Chrome', 'POW for FF', or better use mounted S3 as explained below.
```

### CLI commands

* `mbake` - Get version and help.
* `mbake .` - Bake/make current directory and Pug files recursively.
* `mbake -t .` - Convert Pug/Riot files to useable tag/js, e.g.: data binding.
* `mbake -i .` - Convert dat.yaml static files to JSON, for dynamic binding. More about this in B-M-SPA docs.

## How to setup mbake

```
# To install mbake:

   npm -g i mbake

   // and run it
   mbake

# to generate a sample project:

   mbake -c

   cd CRUDA

# To generate HTML from Pug and Yaml:

   mbake .

or

   mbake subfoldername

# To see all current mbake switches:

   mbake [enter]
```
So you can work Cloud v2 (no servers), we show how to use mbake with
- Amazon Web Services (AWS) S3 HTTP hosting
- Mounting software Webdrive so you can mount AWS S3 as a drive
- Google Firebase

## Intro - How to use mbake:

(Each of these is on the menu to the left.)

1. Cloud V2 I: Setup S3 as your HTTP server and mount it.
2. Pug I: Learn Pug and static binding; view via S3 HTTP server.
3. Cloud V2 II: Use Firestore for pure client-side CRUD and authentication.
4. Pug II: Do dynamic binding via Pug (and load.js).

Here is what it should look like when done with 1-4
- [mbake part 1](https://youtu.be/-KkPfAnEXyk)


Cloud v2 is Metabake Pillar 1.
Mount is Pillar 2.
Pug is an example of Pillar 4.


## Or: More gentle intro

Click 'Creating Mockups' (to the left). Or take a 'Train-the-Trainer' online class, linked in Resources (to the left).


