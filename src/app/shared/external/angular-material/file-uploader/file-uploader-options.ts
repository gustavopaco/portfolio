export interface FileUploaderOptions {
  API_URL?: string,
  MAX_FILE_SIZE: number,
  MIME_TYPES: string[],
  MULTIPLE_FILES: boolean,
  MAX_FILES: number,
  data: any
}
