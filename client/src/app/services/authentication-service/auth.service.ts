import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from 'src/app/models/user-login';
import { UserRegister } from 'src/app/models/user-register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: any;
  constructor(private httpClient: HttpClient) {}
  public server: string = 'http://localhost:5000/';
  public checkUserName(data: any) {
    const formData = {
      userName: data,
    };
    return this.httpClient.post(this.server + 'check-user-name/', formData);
  }
  public handleRegister(data: UserRegister, profileImage: File) {
    const { fullName, userName, role, email, phoneNumber, password } = data;
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('userName', userName);
    formData.append('role', role);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('profileImage', profileImage);

    return this.httpClient.post(this.server + 'register/', formData);
  }
  public getRegisteredUsers() {
    return this.httpClient.get(this.server + 'get-registered-users/');
  }
  public updateUser(data: UserRegister, email: any, profileImage: File) {
    const { fullName, role, phoneNumber, password } = data;
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('role', role);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('profileImage', profileImage);
    return this.httpClient.put(this.server + 'update-user/', formData);
  }
  public deleteUser(email: any) {
    return this.httpClient.delete(this.server + 'delete-user/' + email);
  }
  public fetchUserInfoForEdit(email: any) {
    const formData = {
      email: email,
    };
    return this.httpClient.post(
      this.server + 'fetch-user-info-for-edit/',
      formData
    );
  }
  public handleLogin(data: UserLogin) {
    const { email, password } = data;
    const formData = {
      email: email,
      password: password,
    };
    return this.httpClient.post<UserLogin>(this.server + `login/`, formData);
  }
  public fetchUserNames() {
    return this.httpClient.get<any>(this.server + 'fetch-user-names/');
  }
  public handleLogout() {
    this.currentUser = null;
    localStorage.clear();
  }
  public isLoggedIn() {
    return localStorage.getItem('token');
  }
  public getCurrentUser() {
    this.currentUser = localStorage.getItem('user');
    return this.currentUser;
  }
  public storeUserData(token: any, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
