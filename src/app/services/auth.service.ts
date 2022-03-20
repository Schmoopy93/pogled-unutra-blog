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
  constructor(private http: HttpClient) {
    //this.usersURL = 'http://localhost:4000/api/auth/users';
   }
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  // register(username: string, email: string, password: string, firstname: string, lastname: string): Observable<any> {
  //   return this.http.post(AUTH_API + 'signup', {
  //     username,
  //     email,
  //     password,
  //     firstname,
  //     lastname
  //   }, httpOptions);
  // }

  register(file: File, username: string, email: string, password: string, firstname: string, lastname: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('username', username);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('firstname', firstname);
    formdata.append('lastname', lastname);

    const req = new HttpRequest('POST', 'http://localhost:4000/api/auth/signup/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }


  // getUserById(id: any) {
  //   return this.http.get(`${USER_API}/${id}`).subscribe(res => console.log(res, 'res pls'));
  // }

  // public getUserById(id) {
  //   return this.http.get(`${this.usersURL}/${id}`);
  // }

  getUserById(id): Observable<any> {
    return this.http.get(`${USER_API}/${id}`);
  }

  verifyUser(confirmationCode: string) {
    return this.http.get(`${AUTH_API}confirm/` + confirmationCode);
  }

  getUserByToken(confirmationCode: any){
    return this.http.get(`${AUTH_API}confirm/` + confirmationCode);
  }
}
