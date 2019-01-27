## PROMISE and PROMISE.ALL

JavaScript is single threaded, meaning that two bits of script cannot run at the same time; they have to run one after another. In browsers, JavaScript shares a thread with a load of other stuff that differs from browser to browser. But typically JavaScript is in the same queue as painting, updating styles, and handling user actions (such as highlighting text and interacting with form controls). Activity in one of these things delays the others.

### How Promises Work

A promise is an object which can be returned synchronously from an asynchronous function. It will be in one of 3 possible states:

1. **Fulfilled:** onFulfilled() will be called (e.g., resolve() was called)
2. **Rejected:** onRejected() will be called (e.g., reject() was called)
3. **Pending:** not yet fulfilled or rejected

A promise is settled if it’s not pending (it has been resolved or rejected). Sometimes people use resolved and settled to mean the same thing: not pending.

Once settled, a promise can not be resettled. Calling resolve() or reject() again will have no effect. The immutability of a settled promise is an important feature.

Native JavaScript promises don’t expose promise states. Instead, you’re expected to treat the promise as a black box. Only the function responsible for creating the promise will have knowledge of the promise status, or access to resolve or reject.