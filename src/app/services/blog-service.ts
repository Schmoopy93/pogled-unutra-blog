import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Post } from '../models/post';
import { Comment } from '../models/comment'

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

  constructor(private http: HttpClient) {
    this.postsURL = 'http://localhost:4000/api/auth/posts';
    this.commentURL = 'http://localhost:4000/api/auth/showComments'
  }

  public findAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsURL);
  }

  public findAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.commentURL);
  }

  public getCommentsByPost(postId) : Observable<any> {
    let params = new HttpParams().set('postId', postId);
    return this.http.get(`${this.commentURL}/`, { params: params });
  }

  public getPostById(id) {
    return this.http.get(`${this.postsURL}/${id}`);
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

  addComment(content: string): Observable<any> {
    const pathName = window.location.pathname.split('/')
    const postId =+ pathName[pathName.length - 1];


    return this.http.post(AUTH_API + 'comments', {
      postId,
      content,
    }, httpOptions);
  }


}
