export interface S3Options {

  // The bucket to upload to
  bucket?: string;

  // The region of your bucket
  region?: string;

  // The folder inside your bucket
  folder?: string;

  // The AWS access key for your bucket
  accessKeyId?: string;

  // The AWS secret key for your bucket
  secretAccessKey?: string;

  // The AWS session token if using temporary credentials
  sessionToken?: string;

  // The AWS s3 endpoint for your bucket
  endpoint?: string;

  // The AWS s3 endpoint for your bucket
  s3ForcePathStyle?: boolean;

  // The AWS s3 signature version
  signatureVersion?: string;

  // The AWS s3 ACL for your bucket
  acl?: string;

  // The AWS s3 storage class for your bucket
  storageClass?: string;

  // The AWS s3 server-side encryption for your bucket
  serverSideEncryption?: string;

  // The AWS s3 metadata for your bucket
  metadata?: any;

  // The AWS s3 httpOptions for your bucket
  httpOptions?: any;

  // The AWS s3 encoding for your bucket
  encoding?: string;

  // The AWS s3 gzip for your bucket
  gzip?: boolean;

  // The AWS s3 cacheControl for your bucket
  cacheControl?: string;

  // The AWS s3 expires for your bucket
  expires?: string;

  // The AWS s3 tagging for your bucket
  tagging?: string;

  // The AWS s3 serverSideEncryptionCustomerAlgorithm for your bucket
  serverSideEncryptionCustomerAlgorithm?: string;

  // The AWS s3 serverSideEncryptionCustomerKey for your bucket
  serverSideEncryptionCustomerKey?: string;

  // The AWS s3 serverSideEncryptionCustomerKeyMD5 for your bucket
  serverSideEncryptionCustomerKeyMD5?: string;

  // The AWS s3 bucketLoggingTargetPrefix for your bucket
  bucketLoggingTargetPrefix?: string;

  // The AWS s3 bucketWebsiteIndexDocument for your bucket
  bucketWebsiteIndexDocument?: string;

  // The AWS s3 bucketWebsiteErrorDocument for your bucket
  bucketWebsiteErrorDocument?: string;

  // The AWS s3 bucketWebsiteRoutingRules for your bucket
  bucketWebsiteRoutingRules?: string;

}
