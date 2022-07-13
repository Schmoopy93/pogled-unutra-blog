import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, DoCheck, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment'
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit, AfterContentChecked {

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
  pageSize = 10;
  pageSizes = [10, 20, 30];
  currentIndex = -1;
  replyUser : any;
  postId: any;
  currPostId: any;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;

  constructor(private blogService: ServiceblogService, private authService: AuthService, public sanitizer: DomSanitizer, private route: ActivatedRoute, private token: TokenStorageService) {}
  
  ngOnInit(): void {
    if (this.token.getToken()) {
      this.isLoggedIn = true;
    }  
    this.getPost(this.route.snapshot.params.id);
    this.postId = this.route.snapshot.params.id;
    this.retrieveComments();
    this.replyUser = this.token.getUser();
    this.getCurrentUser();
  }

  ngAfterContentChecked(): void {
    if (!this.user) {
      this.user = this.getUserById(this.currentPost?.userId);
    }
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

  retrieveComments(): void {
    const params = this.getRequestParams(this.page, this.pageSize, this.postId);
    this.blogService.getAllComments(params)
    .subscribe(
      response => {
        const { comments, totalItems, postId } = response;
        this.comments = comments;
        this.count = totalItems;
        this.postId = postId;
        
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


  onSubmit(): void {
    const { content } = this.form;
    this.blogService.addComment(content, this.currentPost.id, this.currentUser).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();

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

}