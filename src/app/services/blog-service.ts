import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { TokenStorageService } from './token-storage.service';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../models/appointment';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ServiceblogService {
  Posts: Post[];

  constructor(
    private http: HttpClient,
    private token: TokenStorageService,
    private route: ActivatedRoute
  ) {}

  getAllPosts(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'posts', { params });
  }

  getAllPostsForHomePage(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'postsHomePage', { params });
  }

  getAllPostsWithoutParams(): Observable<any> {
    return this.http.get<any>(API_URL + 'posts');
  }

  getAllComments(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'showAllPaginatedComments', { params });
  }

  getAllAppointments(): Observable<any> {
    return this.http.get<any>(API_URL + 'findAllAppointments');
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(API_URL + `updateAppointment/${appointment.id}`, appointment);
  }

  getAllTimelines(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'showAllPaginatedTimelines', { params });
  }

  findByTitle(title: any): Observable<Post[]> {
    return this.http.get<Post[]>(API_URL + `posts?title=${title}`);
  }

  public getPostById(id: number) {
    if (id) {
      return this.http.get(API_URL + `posts/${id}`);
    }
    return null;
  }

  addPost(file: File, title: string, content: string, userId: string, categoryId: any): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('content', content);
    formdata.append('userId', userId);
    formdata.append('categoryId', categoryId);

    const req = new HttpRequest('POST', API_URL + 'posts/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }

  editPost(id) {
    return this.http.get(API_URL + `posts/${id}`);
  }

  updatePost(file: File | null, title: string, content: string, userId: string, categoryId: any, id: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userId', userId);
    formData.append('categoryId', categoryId);
    if (file) {
      formData.append('file', file);
    }
    return this.http.put(API_URL + `posts/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(API_URL + `posts/${id}`, { responseType: 'text' });
  }

  deleteHistoryNotificationById(id: number): Observable<any> {
    return this.http.delete(API_URL + `notificationsHistory/${id}`, { responseType: 'text' });
  }

  addComment(content: string, postId: number, userId: number): Observable<any> {
    return this.http.post(API_URL + 'comments', {
      postId,
      content,
      userId
    }, httpOptions);
  }

  likePost(userId: number, postId: number): Observable<any> {
    return this.http.post(API_URL + 'posts/likes', {
      userId,
      postId,
    }, httpOptions);
  }

  getLikesByPostId(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'showLikesByPost', { params });
  }

  getLikesByTimelineId(): Observable<any> {
    return this.http.get<any>(API_URL + 'showLikesByTimeline');
  }

  getLikesByTimelineIds(id: number): Observable<any> {
    return this.http.get(API_URL + `showTimelines/${id}`, { responseType: 'text' });
  }

  addTimeline(text: string, userId: number): Observable<any> {
    return this.http.post(API_URL + 'timelines', {
      text,
      userId
    }, httpOptions);
  }

  deleteTimeline(id: number): Observable<any> {
    return this.http.delete(API_URL + `deleteTimelines/${id}`, { responseType: 'text' });
  }

  likeTimeline(userId: number, timelineId: number): Observable<any> {
    return this.http.post(API_URL + 'timeline/likesTimeline', {
      userId,
      timelineId,
    }, httpOptions);
  }

  getTimelineById(id) {
    return this.http.get(API_URL + `showTimelines/${id}`);
  }

  editTimeline(id) {
    return this.http.get(API_URL + `showTimelines/${id}`);
  }

  updateTimeline(timelineText, id) {
    const obj = {
      text: timelineText
    };
    this.http.put(API_URL + `editTimelines/${id}`, obj).subscribe();
  }

  deleteComment(id: number): Observable<any> {
    return this.http.delete(API_URL + `showComments/${id}`, { responseType: 'text' });
  }

  editComment(id) {
    return this.http.get(API_URL + `showComments/${id}`);
  }

  updateCommentById(content, id) {
    const obj = {
      content: content
    };
    this.http.put(API_URL + `editComment/${id}`, obj).subscribe();
  }

  addAppointment(event) {
    return this.http.post(API_URL + 'createAppointments', event);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(API_URL + `findAllAppointments/${id}`, { responseType: 'text' });
  }

  follow(userId: number, followerId: number, message: string): Observable<any> {
    return this.http.post(API_URL + 'following', {
      userId,
      followerId,
      message
    }, httpOptions);
  }

  getFollows(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'followRequest', { params });
  }

  getNotifications(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'notifications', { params });
  }

  unfollow(id: number): Observable<any> {
    return this.http.delete(API_URL + `unfollow/${id}`, { responseType: 'text' });
  }

  addGallery(file: File, title: string, userId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('userId', userId);

    const req = new HttpRequest('POST', API_URL + 'photogallery/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }

  changeProfilePicture(file: File, userId: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('userId', userId);

    const req = new HttpRequest('PUT', API_URL + 'changeProfilePicture/upload', formdata, {
      reportProgress: true,
      responseType: 'text',
    });

    return this.http.request(req);
  }

  getAllGallery(params: any): Observable<any> {
    return this.http.get<any>(API_URL + 'gallery', { params });
  }

  getPhotoById(id) {
    return this.http.get(API_URL + `gallery/${id}`);
  }

  deletePhoto(id: number): Observable<any> {
    return this.http.delete(API_URL + `gallery/${id}`, { responseType: 'text' });
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(API_URL + 'findAllCategories');
  }

  addCategory(text: string): Observable<any> {
    return this.http.post(API_URL + 'posts/createCategory', {
      text
    }, httpOptions);
  }

  createMessageFromSocket(text: string, userId: string): Observable<any> {
    return this.http.post(API_URL + 'createMessageFromSocket', {
      text,
      userId
    }, httpOptions);
  }

  getNotificationsHistory(userId: string): Observable<any> {
    const params = { userId: userId };
    return this.http.get<any>(API_URL + 'notificationsHistory', { params });
  }
}