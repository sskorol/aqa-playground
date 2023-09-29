import { makeAutoObservable } from 'mobx';
import api from '../api';
import { AxiosRequestConfigExt } from '../types/AxiosRequestConfigExt';
import { AxiosResponse } from 'axios';

class AuthStore {
  isLoggedIn = false;
  username = '';
  accessToken = '';
  refreshToken = '';
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      this.setAccessToken(token);
      this.setRefreshToken(refreshToken);
      this.setIsLoggedIn(true);
    }
  }

  async signup(username: string, email: string, password: string) {
    try {
      const config: AxiosRequestConfigExt = { isPublic: true };
      const response = await api.post(
        '/auth/signup',
        { username, password, email },
        config,
      );
      this.handleAuth(username, response);
    } catch (error) {
      this.setError('Unable to sign up');
    }
  }

  async login(username: string, password: string) {
    try {
      const config: AxiosRequestConfigExt = { isPublic: true };
      const response = await api.post(
        '/auth/login',
        { username, password },
        config,
      );
      this.handleAuth(username, response);
    } catch (error) {
      this.setError('Invalid username or password');
    }
  }

  handleAuth(username: string, response: AxiosResponse) {
    if (
      response.data &&
      response.data.accessToken &&
      response.data.refreshToken
    ) {
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken && username) {
        this.setIsLoggedIn(true);
        this.setUsername(username);
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
      }
    }
  }

  logout() {
    this.clearError();
    this.setIsLoggedIn(false);
    this.setUsername('');
    this.setAccessToken('');
    this.setRefreshToken('');
  }

  clearError() {
    this.setError(null);
  }

  setError(value: string | null) {
    this.error = value;
  }

  setAccessToken(value: string) {
    this.accessToken = value;
    if (this.accessToken) {
      localStorage.setItem('accessToken', this.accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  setUsername(value: string) {
    this.username = value;
  }

  setIsLoggedIn(value: boolean) {
    this.isLoggedIn = value;
  }

  setRefreshToken(value: string) {
    this.refreshToken = value;
    if (this.refreshToken) {
      localStorage.setItem('refreshToken', this.refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }
}

const authStore = new AuthStore();

export default authStore;
