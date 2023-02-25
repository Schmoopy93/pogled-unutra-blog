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

  getAllPostsForHomePage(params: any): Observable<any> {
    return this.http.get<any>(this.commURL + 'postsHomePage', { params });
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

  likePost(userId: number, postId:number): Observable<any> {
    return this.http.post(this.postsURL + '/likes', {
      userId,
      postId,
    }, httpOptions);
  }

  getLikesByPostId(params: any): Observable<any> {
    return this.http.get<any>(`${AUTH_API}showLikesByPost`, { params });
  }

  getLikesByTimelineId(): Observable<any> {
    return this.http.get<any>(`${AUTH_API}showLikesByTimeline`);
    
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

  likeTimeline(userId: number, timelineId:number): Observable<any> {
    return this.http.post(AUTH_API + 'timeline/likesTimeline', {
      userId,
      timelineId,
    }, httpOptions);
  }

  getTimelineById(id) {
    return this
      .http
      .get(`${AUTH_API}showTimelines/${id}`);
  }

  editTimeline(id) {
    return this.http.get(`${AUTH_API}showTimelines/${id}`);
  }
  updateTimeline(timelineText, id) {

    const obj = {
      text: timelineText
    };
    this
      .http
      .put(`${AUTH_API}editTimelines/${id}`, obj)
      .subscribe();
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(`${this.commentURL}/${id}`, { responseType: 'text' });
  }

  editComment(id) {
    return this.http.get(`${AUTH_API}showComments/${id}`);
  }

  updateCommentById(content, id) {

    const obj = {
      content: content
    };
    this
      .http
      .put(`${AUTH_API}editComment/${id}`, obj)
      .subscribe();
  }

  addAppointment(event) {
    return this.http.post(AUTH_API + 'createAppointments', event);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API + 'findAllAppointments'}/${id}`, { responseType: 'text' });
  }

  follow(userId: number, followerId:number, message: string): Observable<any> {
    return this.http.post(AUTH_API + 'following', {
      userId,
      followerId,
      message
    }, httpOptions);
  }

  getFollows(params: any): Observable<any> {
    return this.http.get<any>(AUTH_API + 'followRequest', { params });
  }

  getNotifications(params: any): Observable<any> {
    return this.http.get<any>(AUTH_API + 'notifications', { params });
  }

  unfollow(id: number): Observable<any> {
    return this.http.delete(`${AUTH_API + 'unfollow'}/${id}`, { responseType: 'text' });
  }

  addGallery(file: File, title: string, userId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('userId', userId);

    const req = new HttpRequest('POST', 'http://localhost:4000/api/auth/photogallery/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }

  getAllGallery(params: any): Observable<any> {
    return this.http.get<any>(this.commURL + 'gallery', { params });
  }

  getPhotoById(id) {
    return this
      .http
      .get(`${this.commURL}gallery/${id}`);
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.commURL}gallery/${id}`, { responseType: 'text' });
  }
}
