import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:4000/api/auth/';
const USER_API = `http://localhost:4000/api/auth/users`;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersURL: string;
  constructor(private http: HttpClient) {}
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }
  register(file: File, username: string, email: string, password: string, repeatPassword: string, firstname: string, lastname: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('username', username);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('repeatPassword', repeatPassword);
    formdata.append('firstname', firstname);
    formdata.append('lastname', lastname);

    const req = new HttpRequest('POST', 'http://localhost:4000/api/auth/signup/upload', formdata, {
      reportProgress: true,
      responseType: 'json',
      
    });
    return this.http.request(req);
  }

  getUsers(){
    return this.http.get(USER_API);
  }

  getRoles(){
    return this.http.get(`${AUTH_API}roles`);
  }
  editUser(id) {
    return this.http.get(`${USER_API}/${id}`);
  }
  updateUser(username,phone, address, town, id) {

    const obj = {
      username: username,
      phone: phone,
      address: address,
      town: town
    };
    this
      .http
      .put(`${USER_API}/${id}`, obj)
      .subscribe();
  }

  promoteToAdmin(roleId, userId) {

    const obj = {
      roleId: 3,
    };
    this
      .http
      .put(`${AUTH_API}roles/${userId}`, obj)
      .subscribe();
  }

  
  promoteToModerator(roleId, userId) {

    const obj = {
      roleId: 2,
    };
    this
      .http
      .put(`${AUTH_API}roles/${userId}`, obj)
      .subscribe();
  }

  demoteToUser(roleId, userId) {

    const obj = {
      roleId: 1,
    };
    this
      .http
      .put(`${AUTH_API}roles/${userId}`, obj)
      .subscribe();
  }

  fillYourData(address, phone, id) {

    const obj = {
      address: address,
      phone: phone
    };
    this
      .http
      .put(`${USER_API}`, obj)
      .subscribe();
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${USER_API}/${id}`, { responseType: 'text' });
  }
  getUserById(id): Observable<any> {
    return this.http.get(`${USER_API}/${id}`);
  }

  verifyUser(confirmationCode: string) {
    return this.http.get(`${AUTH_API}confirm/` + confirmationCode);
  }

  acceptFriendship(id: string) {
    return this.http.get(`${AUTH_API}acceptFriendship/` + id);
  }

  setNewPassword(password: any, repeatPassword: any, token: string): Observable<any> {
    return this.http.post(USER_API + '/new-password', {
      password,
      repeatPassword,
      token
    }, httpOptions);
  }

  sendEmailContractForm(name: any, email: any, message: any): Observable<any> {
    return this.http.post(AUTH_API + 'send-email', {
      name,
      email,
      message
    }, httpOptions);
  }



  getUserByToken(confirmationCode: any){
    return this.http.get(`${AUTH_API}confirm/` + confirmationCode);
  }

  getAllUsers(params: any): Observable<any> {
    return this.http.get<any>(`${USER_API}/list-users`, { params });
  }

  getAllUsersForSearch(params: any): Observable<any> {
    return this.http.get<any>(`${USER_API}`, { params });
  }
  
  forgotPassword(email: any): Observable<any> {
    return this.http.post(USER_API + '/retrieve-password', {
      email,
    }, httpOptions);
  }

  getMyFollowers(params: any): Observable<any> {
    return this.http.get<any>(`${AUTH_API}getFollowers`, { params });
  }
}
