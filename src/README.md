
# Install WebAdmin

1. Before you run, create free emailJs ( https://www.emailjs.com ) account: so Meta Intuition accounts can be validated via email.
Also create a email template, and note your emailJs id.

2. Create a (linux) instance in the cloud, for example on Digital Ocean.

3. Install node, yarn

4. `yarn global add intu`

5. In Terminal: `intu`

6. Setup configurations in the browser window `:9081/setup`
Remember your email and password.

7. Fast URL's
   `:9081/admin` - to add users
   `:9081/editors` - to edit site

8. Optional: Use HTTP server (eg: Caddy) to proxy :9081 to get https

