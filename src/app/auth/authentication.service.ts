import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.model';


@Injectable()
export class AuthenticationService {

  // Bypassing the HTTP interceptor by sending pre-defined auth headers
  noAuthHeader = {headers: new HttpHeaders({'NoAuth': 'True'})};

  constructor(private http: HttpClient) {
  }

  // HTTP methods
  signIn(credentials) {
    return this.http.post(environment.apiEntryPoint + 'signin', credentials, this.noAuthHeader);
  }

  signUp(user: User) {
    return this.http.post(environment.apiEntryPoint + 'signup', user);
  }

  getUser() {
    return this.http.get(environment.apiEntryPoint + 'user');
  }


  // Helper Methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

}
