## Cloud V2 I: Setup S3 as your HTTP server and mount it

mbake is serverless. You do not need to install or maintain any HTTP, DB or any other server.

Exception: when using Meta admin/build as a bespoke automation tool.

## Steps

0. Create an AWS account if you don't already have one.

1. In AWS Menu 'Account - My Security Credentials', create a new Access Key, click 'Show Access Key', and copy it for use below. (Advanced users can later use IAM instead.)

2. Create an AWS S3 'bucket' in your default region(eg: N Virginia). Your default region is the one listed in AWS Dashboard menu - on top right. You should not mix regions. (also it largely does not matter what region you pick)
Here is a list of regions <a href='https://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region>AWS Regions list</a>


3. Once a bucket is created, on the bucket Properties tab, select 'Static website hosting' and 'Use this bucket to host a website'. Copy the Endpoint URL for use below. Once created, on the Detail Permissions tab, configure the access policy so that the bucket can be accessed via HTTP. Replace 'YOUR-BUCKET' with your bucket name.

	```
	{
		"Version":"2012-10-17",
		"Statement": [{
			"Sid":"PublicReadGetObject",
				"Effect":"Allow",
			"Principal": "*",
				"Action":["s3:GetObject"],
				"Resource":["arn:aws:s3:::YOUR-BUCKET/*"
				]
			}]
	}
	```

4. Install WebDrive or similar mount software. There are more than a dozen choices <a href='https://tinyurl.com/y9rlmr4t'>S3 Mount</a>

Mount replaces FTP.

5. In WebDrive, create a new Amazon S3 connection. Paste Access Key ID and Secret Access Key created in Step 1 above. Also the region must match and you should not mix regions.

Use this mounted drive to store your project/application. Access it in the browser via the Endpoint URL copied in Step 3 above.

Note: For your CSS files, set their S3 Overview/Metadata/Content-Type to text/css.

