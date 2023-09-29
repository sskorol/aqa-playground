import { AxiosRequestConfig } from 'axios';

export interface AxiosRequestConfigExt extends AxiosRequestConfig {
  isPublic?: boolean;
}
