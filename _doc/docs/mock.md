
# Creating Mockups

mbake lets you rapidly create mockups.

```
   # We recommend to 'cd' to your S3 mounted drive and work there. Also read Serverless I (see link to the left).

   mbake -m
   cd mock
   mbake .

```

Now you can clone a screen and add it to the layout by editing the Pug file in the layout folder.

As you edit files, you need to run:
```
   mbake .
```
This will build the Pug files into html. After you are comfortable with mbake, in the Meta section you will learn how you and your entire team can 'auto build' via Meta's open source cloud service.


#### Default Front End framework

The default front end framework used in most examples is Bulma - due to its relatively small size and ease of use.
NOTE: Bulma CSS has been customized to remove things not needed. For example, it uses [kumailht/gridforms](http://github.com/kumailht/gridforms). You can look at the FE Frameworks Bulma folder to see SASS modules commented out.

Find more on CSS in docs for B-M-SPA.
