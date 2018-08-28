## Using a CDN

mbake sites and apps support the use of a Content Delivery Network (CDN) for scalability and caching. For greater performance, CDNs cache your static files in multiple distributed datacenters. 

With a CDN, you also get to use SSL/HTTPS with your own domain, so it's great to mask the long AWS S3 HTTP domain name, even if you don't need extra performance. You don't need buy an expensive SSL certificate when you use a CDN, so it might be cheaper for you overall. You may end up getting the CDN's extra performance for free! We recommend <a href='https://www.cdn77.com' target='_blank'>https://www.cdn77.com</a>. 

### Steps

1. To give your site a 'proper' domain, you will need a domain name and DNS. If you do not have a domain yet, we recommend to register a cheap domain at <a href='https://www.namecheap.com/' target='_blank'>https://www.namecheap.com</a> now and have it use the namecheap DNS.
If you already own a domain and host a site, e.g. at `www.mydomain.com`, you may want to configure a CNAME to map a `'staging.'` subdomain, such as `staging.mydomain.com`, so you can keep using `'www.'` for your public site. See Step 4 below for more detailed instructions. 

2. Register for the <a href='https://www.cdn77.com' target='_blank'>CDN77</a> 14-day free trial.

3. In the CDN77 web app, go to menu item CDN and click 'ADD NEW CDN RESOURCE'. Give it a label, such as 'staging.mydomain.com' and select 'My Origin'. As domain, specify HTTP and the S3 DOMAIN you used in [Tutorial 2](/t2/) (e.g. wgehner-fire-ro.s3-website-us-west-1.amazonaws.com). Click 'CREATE CDN RESOURCE'.

4. Choose 4-step setup with CNAME. Click 'Add new CNAME', and '+ ADD CNAMES'. Enter 'staging.mydomain.com' and Click 'ADD CNAME'. Click 'Go back to Integration'. In Step 2, copy the DOMAIN NAME (AKA HOST), e.g 1234567890.rsc.cdn77.org, then follow instructions for your hosting provider. If your domain is with namecheap.com, do the following:
On the Namecheap dashbord, click 'Manage' for your domain, and 'Advanced DNS'. Click 'ADD NEW RECORD', select 'CNAME' and enter the following: Host: staging Value: [DOMAIN NAME from clipboard, e.g. 1234567890.rsc.cdn77.org], TTL: Automatic. Click the checkmark to save. No need to do CDN77 Step 3. One final step is to go to the CDN77 'Other Settings' tab, set 'Cache expiry' to 10 minutes, check 'HTTPS redirect' and click 'SAVE CHANGES'.

5. After an hour after the initial setup, you should be able to reach the deployed site in your browser under <https://staging.mydomain.com>. Note the use of `'https'`. If you visit too quickly, the browser will complain that the site certificate is invalid. If this happens, try again after a while. 