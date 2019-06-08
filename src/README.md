
# Install WebAdmin Meta 'Intuition'

#### 'It will lead YOU in the right direction'

1. Before you run, create free emailJs ( https://www.emailjs.com ) account: so Meta Intuition accounts can be validated via email.
Also create a email template, and note your emailJs id, needed to send emails.

2. Create a (linux) instance in the cloud, for example on Digital Ocean. 

2. Optional: If you will run a large site with terabytes and petabytes, create a NAS, or you can migrate later.

3. Install node, yarn

4. `yarn global add intu`

5. In Terminal: `intu`

6. Setup configurations in the browser window `:9081/setup`
Remember your admin email and password. (TODO: Validate admin code)

7. Fast URL's
   `:9081/admin` - to add users
   `:9081/editors` - to edit site

8. Optional: Use HTTP server (eg: Caddy) to proxy :9081 to get https

(TODO: Change path, change port, extract CMS, eCom, Website. At install pick a sample)

(TODO: a lot of noise on logger, add editor screen has 'old data', make admin be editor auto, even if not listed, changed admin command: for admin )
(TODO: add editor does nothing, no logo - our logo only, adding an editor: no password!. during code they set password, list does not work )