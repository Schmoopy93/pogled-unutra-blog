import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Post } from '../models/post';
import { TokenStorageService } from './token-storage.service';
import { ActivatedRoute } from '@angular/router';

const AUTH_API = 'http://localhost:4000/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {
  Posts: Post[];
  postsURL: string;
  commentURL: string;
  commURL: string;

  constructor(private http: HttpClient, private token: TokenStorageService, private route: ActivatedRoute) {
    this.postsURL = 'http://localhost:4000/api/auth/posts';
    this.commentURL = 'http://localhost:4000/api/auth/showComments'
    this.commURL = 'http://localhost:4000/api/auth/'
   
  }
  getAllPosts(params: any): Observable<any> {
    return this.http.get<any>(this.postsURL, { params });
  }

  getAllComments(params: any): Observable<any> {
    return this.http.get<any>(this.commURL + 'showAllPaginatedComments', { params });
  }

  getAllAppointments(): Observable<any> {
    return this.http.get<any>(`${AUTH_API}findAllAppointments`);
  }

  getAllTimelines(params: any): Observable<any> {
    return this.http.get<any>(this.commURL + 'showAllPaginatedTimelines', { params });
  }

  findByTitle(title: any): Observable<Post[]> {
    return this.http.get<Post[]>(`${(this.postsURL)}?title=${title}`);
  }

  public getPostById(id: number) {
    if (id) {
      return this.http.get(`${this.postsURL}/${id}`);
    }
    return null;
  }

  addPost(file: File, title: string, content: string, userId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append('userId', userId);

    const req = new HttpRequest('POST', 'http://localhost:4000/api/auth/posts/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }


  editPost(id) {
    return this
      .http
      .get(`${this.postsURL}/${id}`);
  }

  updatePost(title, content, id) {

    const obj = {
      title: title,
      content: content,
    };
    this
      .http
      .put(`${this.postsURL}/${id}`, obj)
      .subscribe();
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.postsURL}/${id}`, { responseType: 'text' });
  }

  addComment(content: string, postId: number, userId:number): Observable<any> {
    return this.http.post(AUTH_API + 'comments', {
      postId,
      content,
      userId
    }, httpOptions);
  }

  addTimeline(text: string, userId:number): Observable<any> {
    return this.http.post(AUTH_API + 'timelines', {
      text,
      userId
    }, httpOptions);
  }
  
  deleteTimeline(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API}deleteTimelines/${id}`, { responseType: 'text' });
  }

  editTimeline(id) {
    return this
      .http
      .get(`${AUTH_API}showTimelines/${id}`);
  }
  updateTimeline(text, id) {

    const obj = {
      text: text
    };
    this
      .http
      .put(`${AUTH_API}timelines/${id}`, obj)
      .subscribe();
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.commentURL}/${id}`, { responseType: 'text' });
  }

  addAppointment(event) {
    return this.http.post(AUTH_API + 'createAppointments', event);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API + 'findAllAppointments'}/${id}`, { responseType: 'text' });
  }

  follow(userId: number, followerId:number): Observable<any> {
    return this.http.post(AUTH_API + 'following', {
      userId,
      followerId
    }, httpOptions);
  }

  getFollows(params: any): Observable<any> {
    return this.http.get<any>(AUTH_API + 'followRequest', { params });
  }

  unfollow(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API + 'unfollow'}/${id}`, { responseType: 'text' });
  }
}
