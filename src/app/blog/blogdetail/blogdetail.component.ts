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
  commentUser = null;
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
  commentPaginate: Comment[] = [];
  currentIndex = -1;
  replyUser = null;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;

  constructor(private blogService: ServiceblogService, private authService: AuthService, public sanitizer: DomSanitizer,
    private router: Router, private route: ActivatedRoute, private token: TokenStorageService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (this.token.getToken()) {
      this.isLoggedIn = true;
    }  
    this.getCommentByPost(this.route.snapshot.params.id);
    this.getPost(this.route.snapshot.params.id);
    if (!this.user) {
      this.user = this.getUserById(this.currentPost?.userId);
    }
    this.getCurrentUser();
    this.replyUser = this.token.getUser();
    this.retrieveComments();

    this.route.params.subscribe(
      params => {
          const id = +params['id'];
          this.getCommentByPost(id);
      }
  );
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
    const params = this.getRequestParams(this.currentPost, this.page, this.pageSize);

    this.blogService.getAllComments(params)
    .subscribe(
      response => {
        const { commentPaginate, totalItems } = response;
        this.commentPaginate = commentPaginate;
        this.count = totalItems;
      },
      error => {
        console.log(error);
      });
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  ngAfterContentChecked(): void {
    if (!this.user) {
      this.user = this.getUserById(this.currentPost?.userId);
    }
  }

  getCommentByPost(id) {
    this.blogService.getCommentsByPost(id)
      .subscribe(
        data => {
          this.comments = data;

        },
        error => {
          console.log(error);
        });

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

  deletePost(id) {
    this.blogService.deleteComment(id).subscribe(res => {
      console.log('Deleted');
      this.ngOnInit();
    });
  }

  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }

  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return `with: ${reason}`;
  //   }
  // }
  

}