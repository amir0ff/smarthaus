import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from './user.model';


@Injectable()
export class AuthenticationService {
  selectedUser: User = {
    fullName: '',
    email: '',
    password: ''
  };

  noAuthHeader = {headers: new HttpHeaders({'NoAuth': 'True'})};

  constructor(private http: HttpClient) {
  }

  // HTTP methods
  signUp(user: User) {
    return this.http.post(environment.apiEntryPoint + 'register', user, this.noAuthHeader);
  }

  signIn(authCredentials) {
    return this.http.post(environment.apiEntryPoint + 'authenticate', authCredentials, this.noAuthHeader);
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
