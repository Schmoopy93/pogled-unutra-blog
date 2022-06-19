import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Post } from '../models/post';
import { Comment } from '../models/comment'
import { TokenStorageService } from './token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

const AUTH_API = 'http://localhost:4000/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {
  private post$ = new Subject<Post[]>();
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

  public findAllComments(params: any): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentURL, { params });
  }

  public getCommentsByPost(postId): Observable<any> {
    let params = new HttpParams().set('postId', postId);
    return this.http.get(`${this.commentURL}/`, { params: params });
  }

  public getUserByComment(userId): Observable<any> {
    let params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.commentURL}/`, { params: params });
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
      .subscribe(res => console.log('Done'));
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

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.commentURL}/${id}`, { responseType: 'text' });
  }

  addAppointment(event) {
    return this.http.post(AUTH_API + 'createAppointments', event);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API + 'findAllAppointments'}/${id}`, { responseType: 'text' });
  }

}
