import {S3Options} from "./s3-options";

export interface FileUploaderOptions {
  API_URL?: string,
  MAX_FILE_SIZE_MB: number,
  ALLOWED_MIME_TYPES: string[],
  MULTIPLE_FILES: boolean,
  MAX_FILES: number,
  DATA: any,
  S3_OPTIONS?: S3Options,
}
