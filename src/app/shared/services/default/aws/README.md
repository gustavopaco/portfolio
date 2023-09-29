AWS S3 service
=======================
This service is used to upload files to AWS S3 bucket.

## Installation
```
Install the package UUID from npm: 
- npm install uuid
- npm i --save-dev @types/uuid
- npm install @aws-sdk/client-s3
```

## Usage
```
Inject the service in the constructor of the component where you want to use it:
- constructor(private awsS3Service: AwsS3Service) { }
- First in method OnInit() call the method loadS3Client() to load the S3 client.
- Then call the method uploadFile() to upload the file to S3 bucket.
```

