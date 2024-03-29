import {environment} from "../../../environments/environment";

export const API_AUTH = `${environment.API}/auth`;
export const API_RESET_PASSWORD_LINK = "";
export const API_VALIDATE_TOKEN = "";
export const API_RESET_PASSWORD = "";
export const API_USER = `${environment.API}/user`;
export const API_CREDENTIALS = `${environment.API}/credentials`;
export const API_CONTACT = `${environment.API}/contact`;
export const S3_SKILLS_FOLDER = `${environment.s3}/skills`;
export const S3_PROJECTS_FOLDER = `${environment.s3}/projects`;
export const S3_AVATAR_FOLDER = `${environment.s3}/avatar`;
export const S3_CERTIFICATES_FOLDER = `${environment.s3}/certificates`;
export const S3_RESUME_FOLDER = `${environment.s3}/resume`;
export const API_UPLOAD = `${environment.API}/upload`;
export const API_CERTIFICATE = `${API_USER}/certificate`;
export const API_RESUME = `${API_USER}/resume`;
