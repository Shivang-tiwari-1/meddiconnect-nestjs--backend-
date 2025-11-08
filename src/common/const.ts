import { SetMetadata } from '@nestjs/common';

export const SKIP_USER_CHECK = 'skipUserCheck';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Private = () => SetMetadata(IS_PUBLIC_KEY, false);
export enum BUCKET_NAME {
  REPORTS = 'cleverbooks-prod-reports',
  COMMON = 'cleverbooks-prod-common',
}
