import axios, { AxiosInstance } from 'axios';

export class Interceptor {
  protected interceptor: AxiosInstance;

  constructor() {
    this.interceptor = axios.create({
      baseURL: '/api',
      headers: { authorization: this.getToken() },
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
