
# Gentle

Here is gentle intro on Medium:
- <a href='https://medium.com/@WolfgangGehner/using-pug-for-static-and-dynamic-data-binding-56a1cc378b81'>Pug on Medium</a>


# Creating Mockups

mbake lets you rapidly create mockups.

```
   # We recommend to 'cd' to your S3 mounted drive and work there. Also read Cloud V2 I (see link to the left).

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

The default front end framework used in most examples is Spectre CSS, but you can use any of the dozens out there. Spectre has relatively small size, AMP support and ease of use.
