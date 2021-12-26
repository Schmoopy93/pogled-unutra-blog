import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:4000/api/auth/';
const USER_API = `${AUTH_API}users`;


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string, firstname: string, lastname: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      firstname,
      lastname
    }, httpOptions);
  }

  getUserById(id: any) {
    return this.http.get(`${USER_API}/${id}`).subscribe(res => console.log(res, 'res pls'));
  }
  
  verifyUser(confirmationCode: string) {
    return this.http.get(`${AUTH_API}confirm/` + confirmationCode );
}

}
