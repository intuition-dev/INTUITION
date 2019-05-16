
# http-rpc / httpRPC

Like JSON-RPC but for http; with basic security, and page/component argument so you know what page|component called the RPC.

## Access via UNPKG
   https://unpkg.com/http-rpc@1.0.4/httpRPC.min.js

### Fetures:
- Typescript
- no ajax
- no preflight
- Can pack json and if arrary
- Auth like basicauth but in method
- Browser http centric unlike json rpc
- Know what page|component used it


#### You should look at the example here of server side index.ts and client side httpRPC.ts and to use it: main.js. All 3 files are commented.

Note: A page|screen|comp should only call it's service. The back end server can call others as needed.


#### Background
We looked at GraphQL. A lot. we liked client-side code - but we did not see how you could write server-side code
when you had to talk to two DBs - eg pg and elastic search; or how to manage performance on a complex/realistic app.

Then we looked json-rpc and... it is not web centric, so we did this.


### JSON-RPC
- https://dzone.com/articles/a-quick-introduction-to-http-rpc
- https://thomashunter.name/posts/2017-09-27-is-it-time-to-replace-rest-with-rpc
