
# Cloud v2 II: Use Firestore for pure client-side CRUD and authentication

Similar to AWS Cognito, Firebase includes pure client-side user authentication.

Firebase also has push and a database named Firestore.
It can be used from the browser via JavaScript, no custom Cloud v2.0 code is needed. This is key to be able to develop faster.


# CRUDA

In the example app (mbake -a) there are examples:
- https://github.com/metabake/_mBake/tree/master/CRUDA/screens


The CRUDA example app (mbake -c) uses FireStore.

http://github.com/metabake/_mBake/blob/master/CRUDA/layout/crud.pug

FireStore replaces MongoDB, but also ORM, REST, DevOps, Security, Failover, etc. All that complexity is now low-tech. But sadly, just like you had to learn MongoDB for example, you have to learn how to use FireStore.


Also it has an auth example, it is up to you to manage user access for
the users that do not have auth.

## Fetch

When doing fetch, you want to do it in head. So that it is done in parallel with UI.
When data is back, ux is ready to bind - so it's not sequential, and you don't wait. Also FireStore should be in head.

And, since FireStore has secret keys, you should put it in a -tag.
When -tag is made, .min.js file is obfuscated.

