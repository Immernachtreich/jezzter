import { useSnackbar } from '@/context/snackbar-context';
import axios, { AxiosInstance } from 'axios';

export class Interceptor {
  protected interceptor: AxiosInstance;

  constructor(onError: (err: any) => any) {
    this.interceptor = axios.create({
      baseURL: '/api',
      headers: { authorization: this.getToken() },
    });

    this.interceptor.interceptors.response.use(
      response => response,
      (error: any) => {
        onError(error);
        return { data: { isError: true } };
      }
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
