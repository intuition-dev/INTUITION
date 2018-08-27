## Tutorial 1: Setup S3 as your HTTP server and mount it

mbake is Cloud v2.0. You do not need to install or maintain any HTTP, DB or any other server.

## Steps

[A detailed video of the following steps is available <a href="http://wgehnerlab1.metabake.org.s3-website-us-east-1.amazonaws.com/lab1v0.html">here</a>.]

0. Create an AWS account if you don't already have one.

1. In AWS Menu 'Account - My Security Credentials', create a new Access Key, click 'Show Access Key', and copy it (to a file) for use below. (Advanced users can later use IAM instead.)

2. Create an AWS S3 'bucket' in the "US East (N Virginia)" region. (Advanced users can select any region). Name the bucket 'wgehner-fireRO' (replace wgehner with your name or something else unique.

3. On the bucket Properties tab, select 'Static website hosting' and 'Use this bucket to host a website'. Copy the Endpoint URL for use below. Once created, on the Detail Permissions tab, configure the access policy so that the bucket can be accessed via HTTP. Replace 'wgehner-fireRO' with your bucket name.

	```
	{
		"Version":"2012-10-17",
		"Statement": [{
			"Sid":"PublicReadGetObject",
				"Effect":"Allow",
			"Principal": "*",
				"Action":["s3:GetObject"],
				"Resource":["arn:aws:s3:::wgehner-fireRO/*"
				]
			}]
	}
	```

4. Install WebDrive (Advanced users may choose a different mount software. There are more than a dozen [other choices](https://tinyurl.com/y9rlmr4t)). Mount replaces FTP.

5. In WebDrive, create a new Amazon S3 connection. Choose a drive letter (e.g. W:\\). Paste Access Key ID and Secret Access Key created in Step 1 above. If your bucket region is __not__ "US East (N Virginia)", edit the S3 Account URL / Address to match the "Endpoint URL' in [this list](https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region). Example: change https://s3.amazonaws.com to https://s3.us-west-1.amazonaws.com if your region is US West (N. California). In WebDrive, if you don't select a specific bucket, all buckets for the region will show up as top level folders in the mounted drive, and your mounted drive letter effectively represents an S3 region in your AWS account. 

6. To verify that the mount is working, you can put an index.html into the mounted bucket on your file system. You might just copy the index.html you generated [here](../mbake/#how-to-create-a-hello-world-app-with-mbake). Then view it in the browser via the Endpoint URL copied in Step 3 above.

Note: For your CSS files, you will set their S3 Overview/Metadata/Content-Type to text/css.

NEXT: Go to [Tutorial 2](/pug1/).

