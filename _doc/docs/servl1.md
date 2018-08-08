## Cloud V2 I: Setup S3 as your HTTP server and mount it

mbake is serverless. You do not need to install or maintain any HTTP, DB or any other server.

Exception: when using Meta admin/build as a bespoke automation tool.

## Steps

0. Create an AWS account if you don't already have one.

1. In AWS Menu 'Account - My Security Credentials', create a new Access Key, click 'Show Access Key', and copy it for use below. (Advanced users can later use IAM instead.)

2. Create an AWS S3 'bucket' and give it a name.

3. On the bucket Properties tab, select 'Static website hosting' and 'Use this bucket to host a website'. Copy the Endpoint URL for use below. Once created, on the Detail Permissions tab, configure the access policy so that the bucket can be accessed via HTTP.

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

4. Install WebDrive or similar mount software. Mount replaces FTP.

5. In WebDrive, create a new Amazon S3 connection. Paste Access Key ID and Secret Access Key created in Step 1 above.

6. In S3 (Overview/Metadata/Content-Type), fix the CSS files to be text/css.

7. Use this mounted location to store your project/application. E.g. mount -a should extract to that mounted drive.
Access it in browser via URL copied in Step 3 above.
