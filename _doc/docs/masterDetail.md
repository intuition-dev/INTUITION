
# Review example Master/Detail (M/D) CRUD

### Pre-reqs

You should have reviewed Pug 1 and 2, Cloud 2.0 1 and 2 and FE FW (Front end frameworks) project. You should also know basics like 'inspect/copy selector' and 'network/disable cache' in the Chrome browser.

Also use resources link on the left, Chat/Form/Support and check out [DataTables](http://datatables.net)

## Goal of M/D

- Login and get a list.
- Click an item on a list to get edit view
- Edit and save, and see the new list.

You'll leverage Firestore and write Riot tags (components) in Pug.


### Exceptions

Sometimes, but it must be rare in Metabake, you need to write your own API. When doing this, you should *not* document your endpoints/REST server side. Instead write your client-side calls, and document how to use the API.

Check out Axios and 'Documentation js' in resources.

Also, rarely, you need SSR, for example required for payment processing. There is an example in examples for Stripe.
And realistically, you should not use Node.js for production. Here, we use node to build code, but not for production. Same for any server side code, Node.js is not secure and not for enterprise production. A modern server side language is Go, it has support for server side Pug - but likely your apps will not know about anything server side: since they are just using a  documented .js library that does the fetch for them. Make sure your back-end developers are responsible for client side access.
