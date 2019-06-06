

# MetaBake's Tool Belt

Listed dependencies gives you application a list of a election curated js libraries that you may chose to use/require.

- Docs: https://metabake.github.io/mbakeDocs/#/toolBelt

It saves time, sets baseline for depps, defines popular/approved libs:

      mbake -f .

That will emit this code:

      script(src='//unpkg.com/mtool-belt@1.3.38/toolBelt.min.js')

It also contains polyfill and some other frequently needed functions.

 
## Require Depps

The tool belt is built on top of: https://github.com/muicss/johnnydepp

The listed dependencies are just the popular/approved ones, in your apps 'load.js' you can define what you want to use. And then simply require it.
And/or: you don't have to use most of them, or even any of them. But it does demonstrate a base line of how to setup a 

The tool belt also give a bit of application architecture, a baseline on how things work together,  helps manage 'dll hell'



