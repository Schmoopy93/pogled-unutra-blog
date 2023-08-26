import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment'
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { Likes } from 'src/app/models/likes';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit  {
  form: any = {
    content: null,
  }
  posts: Post[];
  currentPost = null;
  currentUser = null;
  currentComment = null
  errorMessage = '';
  comments: any;
  user = null;
  post = null;
  userId: number;
  closeResult = '';
  isLoggedIn = false;
  content = '';
  page = 1;
  count = 0;
  countLikes = 0;
  pageSize = 6;
  pageSizes = [6, 12, 18];
  currentIndex = -1;
  replyUser : any;
  postId: any;
  currPostId: any;
  firstname = '';
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this comment???'
  public cancelClicked: boolean = false;
  users: any;
  likes:any;
  pageLikes = 1;
  pageSizeLikes = 5;
  pageSizesLikes = [5, 10, 15];
  currentIndexLikes = -1;
  currentLike = null;
  check: any;
  userRoute: any = {};
  data: string;
  currUser: any;

  constructor(private blogService: ServiceblogService, private http: HttpClient,  private router: Router, private authService: AuthService, public sanitizer: DomSanitizer, private route: ActivatedRoute, private token: TokenStorageService) {}
  
  ngOnInit(): void {
    this.currUser = this.token.getUser().id;
    if (this.token.getToken()) {
      this.isLoggedIn = true;
    } 
    this.route.params.subscribe(params => {
      this.authService.getUserById(params.id).subscribe(res => {
        this.userRoute = res;
      });
    });
    this.getPost(this.route.snapshot.params.id);
    this.postId = this.route.snapshot.params.id;
    this.retrieveLikes();
    this.retrieveComments();
    this.replyUser = this.token.getUser();
    this.getCurrentUser();
  }

  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
  }

  @ViewChild('hideModalComment') private hideModalComment: ElementRef;
  public hideModalCommentFunc() {
    this.hideModalComment.nativeElement.click();
  }

  getCurrentUser(){
    this.currentUser = this.token.getUser().id
  }

  setActiveComment(comment: Comment, index: number): void {
    this.currentComment = comment;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveComments();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveComments();
  }

  setActiveLikes(like: Likes, index: number): void {
    this.currentLike = like;
    this.currentIndexLikes = index;
  }

  handlePageChangeLikes(event: number): void {
    this.pageLikes = event;
    this.retrieveLikes();
  }

  handlePageSizeChangeLikes(event: any): void {
    this.pageSizeLikes = event.target.value;
    this.pageLikes = 1;
    this.retrieveLikes();
  }
  retrieveComments(): void {
    const params = this.getRequestParams(this.page, this.pageSize, this.postId);
    this.blogService.getAllComments(params)
    .subscribe(
      response => {
        const { comments, totalItems } = response;
        this.comments = comments;
        this.count = totalItems;
      },
      error => {
        console.log(error);
      });
  }

  getRequestParams(page: number, pageSize: number, postId: number): any {
    let params: any = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    if (postId) {
      params[`postId`] = postId;
    }

    return params;
  }

  
  getPost(id) {
    if (!id) return;
    this.blogService.getPostById(id)
      .subscribe(
        data => {
          this.currentPost = data;
        },
        error => {
          console.log(error);
        });

  }

  getUserById(id) {
    this.authService.getUserById(id)
      .subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.log(error);
        });
  }

  @ViewChild('commentForm', { static: false }) commentForm: NgForm;
  resetModalFormPostComment() {
    if (this.commentForm) {
      this.commentForm.resetForm();
    }
  }

  onSubmit(): void {
    const { content } = this.form;
    if (content == undefined || content == null || content == "") {
      Swal.fire("Comment is required!") 
      return;
    }
    this.blogService.addComment(content, this.currentPost.id, this.currentUser).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    this.hideModalCommentFunc();
    this.resetModalFormPostComment();
    this.ngOnInit();
  }

  // likePost(): void {
  //   this.blogService.likePost(this.currentUser, this.postId).subscribe(
  //     data => {
  //       console.log(data);
  //     },
  //     err => {
  //       this.errorMessage = err.error.message;
  //     }
  //   );
  //   if(this.errorMessage){
  //     Swal.fire(this.errorMessage);
  //   }
    
  // }

  retrieveLikes(): void {
    const params = this.getRequestParamsLikes(this.pageLikes, this.pageSizeLikes, this.postId);

    this.blogService.getLikesByPostId(params)
    .subscribe(
      response => {
        const { likes, totalItems } = response;
        this.likes = likes;
        this.countLikes = totalItems;
      },
      error => {
        console.log(error);
      });
  }

  likePost(): void {
    this.blogService.likePost(this.currentUser, this.postId)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) =>  Swal.fire(err.error.message)
      });
      this.retrieveLikes();
      this.ngOnInit();
  }



  getRequestParamsLikes(pageLikes: number, pageSizeLikes: number, postId: number): any {
    let params: any = {};

    if (pageLikes) {
      params[`pageLikes`] = pageLikes - 1;
    }

    if (pageSizeLikes) {
      params[`pageSizeLikes`] = pageSizeLikes;
    }

    if (postId) {
      params[`postId`] = postId;
    }
    return params;
    
  }
  
  deleteComment(id) {
    this.blogService.deleteComment(id).subscribe(res => {
      this.ngOnInit();
    });
  }

  compareAlphabeticallyAsc() : void {
    this.comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  compareAlphabeticallyDesc(): void {
    this.comments.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  generatePDF(postId) {
    postId = this.route.snapshot.params.id;
    const url = 'http://localhost:4000/posts/pdf/' + postId + '?timestamp=' + Date.now();
    const req = this.http.get(url, { responseType: 'arraybuffer', reportProgress: true, observe: 'events' });
    req.subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) { 
      } else if (event.type === HttpEventType.Response) {
        const arrayBuffer = event.body as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const randomString = this.generateRandomString(10);
        const filename = `${postId + randomString + Date.now()}.pdf`;
        saveAs(blob, filename);
      }
    });
  }

  generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
}