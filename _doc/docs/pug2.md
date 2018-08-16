## Pug II: Do dynamic binding via Pug (and load.js).

Note: before creating a tag in pug, you may first want to get it working, as just an include pug. Then, when it works as include, make it a tag.


So let's use Pug to do dynamic binding.
So now that we have a database API and we know Pug, we should allow for CRUD - and that is done in dynamic binding.

We will load the Riot library. Loading has to be in sequence, and using 'MUI load js' works well:
- https://github.com/muicss/loadjs

# CRUDA

In the example app (mbake -a) there are examples:
- https://github.com/metabake/_mBake/tree/master/CRUDA/screens



## mbake -t

When you 'mbake -c', the generated project has a 'riotFirst' folder that contains an example of how to use Riot via Pug.


   first-tag
      p oh hi
      p { num }

      script.
         doSomething(arg) {
            console.log('XXX ', arg)
            this.update({num: arg})
         }


# In Pug, write Riot dynamic binding

MembersTag folder has the dynamic Riot tag done in Pug.

Also it has an auth example, it is up to you to manage user access for
the users that do not have auth.
(In Meta admin layouts folder we use Bulma's modal, you can use as example.)


Note: that pug is compiled into .js (3GL like). That .js is obfuscated, so it can't be read by other developers. So you can store keys - as safe as Andorid's ProGuard.


#### That is it for mbake

mbake also has a mbake -m, and app use for mockups, more on the menu on left.

Once you are comfortable with mbake and its 3 pillars, you can go to the Github project
B-M SPA, the bread and butter section, that demos 5 more pillars
or to
Metabake, the advanced vista section, with 2 more pillars.



