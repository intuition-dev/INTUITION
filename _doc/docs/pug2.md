## Dynamic tags, RIOTjs

So lets use Pug to do dynamic binding.
So now that we have a database api(and we know Pug0, we should allow for CRUD - and that is done in Dynamic binding.

We will load a library, RIOTjs. Loading has to be in sequence, and using 'MUI load js' works well:
- https://github.com/muicss/loadjs

# CRUDA

In the example app (mbake -a) there is examples:
- https://github.com/metabake/_mBake/tree/master/CRUDA/screens



## mbake -t

When you 'meta -c' it has a 'riotFirst' folder, that folder shows first example of how to use RIOTjs via pug.


   first-tag
      p oh hi
      p { num }

      script.
         doSomething(arg) {
            console.log('XXX ', arg)
            this.update({num: arg})
         }


# In Pug write RIOTjs dynamic binding

MembersTag folder has the dynamic RIOTjs tag done in Pug.

Also it has auth example, it is up to you to manage user access for
the users that don't have auth.
( In Meta admin layouts folder I use Bulma's  modal, you can use as example)


#### That is it for mbake

mbake also has a mbake -m, and app use for mockups, more on the menu on left.

Once you are comfortable with mbake and it's 3 pillars, you can go to either:
B-M SPA, the bread and butter section, that demos 5 more pillars
or
MetaBake, the advanced vista section, with 2 more pillars.



