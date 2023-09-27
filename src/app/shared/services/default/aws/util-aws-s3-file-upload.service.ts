import {Injectable} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {DeleteObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

@Injectable({
  providedIn: 'root'
})
export class UtilAwsS3FileUploadService {

  private s3Client: S3Client | undefined;

  loadS3Client(S3_REGION: string, S3_CREDENTIALS_ACCESS_KEY_ID: string, S3_CREDENTIALS_SECRET_ACCESS_KEY: string): void {
    if (this.s3Client === undefined) {
      this.s3Client = new S3Client({
        region: S3_REGION,
        credentials: {
          accessKeyId: S3_CREDENTIALS_ACCESS_KEY_ID,
          secretAccessKey: S3_CREDENTIALS_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  private s3BucketConfigCommandObject(S3_BUCKET_NAME: string, file: File, folder: string): any {
    return {
      Bucket: `${S3_BUCKET_NAME}`,
      Key: `${folder}/${uuidv4()}-${file.name}`,
      Body: file,
    }
  }

  async uploadImagesToAwsS3Bucket(S3_BUCKET_NAME: string, files: Set<File>, folder: string) {
    const imageUrls: string[] = [];
    for (const file of files) {
      const command = new PutObjectCommand(this.s3BucketConfigCommandObject(S3_BUCKET_NAME, file, folder));
      try {
        await this.s3Client?.send(command);
        const imageUrl = `https://${command.input.Bucket}.s3.amazonaws.com/${command.input.Key}`;
        imageUrls.push(imageUrl);
      } catch (error: any) {
        //todo: Show error message
      }
    }
    return imageUrls;
  }

  async uploadSingleImageToAwsS3Bucket(S3_BUCKET_NAME: string, file: File, folder: string) {
    const command = new PutObjectCommand(this.s3BucketConfigCommandObject(S3_BUCKET_NAME, file, folder));
    try {
      this.s3Client?.send(command);
      return `https://${command.input.Bucket}.s3.amazonaws.com/${command.input.Key}`;
    } catch (error: any) {
      //todo: Show error message
      throw error;
    }
  }

  async deleteImageFromAwsS3Bucket(S3_BUCKET_NAME: string, imageUrl: string, folder: string) {
    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: imageUrl.split('.com/')[1],
    });
    try {
      await this.s3Client?.send(command);
    } catch (error: any) {
      //todo: Show error message
    }
  }
}
