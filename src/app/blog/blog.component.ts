import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { ServiceblogService } from '../services/blog-service';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  posts: Post[];
  currentPost = null;
  user: User;
  confirmationCode: string;
  currentPosts?: Post;
  currentIndex = -1;
  title = '';
  page = 1;
  count = 0;
  pageSize = 6;
  pageSizes = [6, 9, 12];
  sortedItems: any;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;

  formData = {
    name: '',
    email: '',
    message: ''
  };
  errorMessage = '';
  constructor(private blogService: ServiceblogService, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.retrievePosts();
    this.confirmationCode = this.route.snapshot.params['confirmationCode'];
    if(!this.confirmationCode){
      return;
    }
    this.router.navigate(['/login'], { relativeTo: this.route, replaceUrl: true });
    this.authService.verifyUser(this.confirmationCode)
      .pipe()
      .subscribe({
        next: () => {
          this.router.navigate(['/'], { relativeTo: this.route });
        }
      });
  }

  setActivePost(post: Post, index: number): void {
    this.currentPost = post;
    this.currentIndex = index;
  }

  retrievePosts(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.blogService.getAllPostsForHomePage(params)
    .subscribe(
      response => {
        const { posts, totalItems } = response;
        this.posts = posts;
        this.count = totalItems;
      },
      error => {
        console.log(error);
      });
  }
  
  handlePageChange(event: number): void {
    this.page = event;
    this.retrievePosts();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrievePosts();
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
  onSubmit() {
    const { name, email, message } = this.formData;
    this.authService.sendEmailContractForm(name, email, message).subscribe(
      () => {
        console.log('Email sent successfully');
        Swal.fire('Success!', 'Email sent successfully', 'success');
        this.router.navigateByUrl('/');
      },
      error => {
        this.errorMessage = error.error.error;
        console.log(this.errorMessage, 'err')
      },
      () => {
        
        console.log('Complete');
        this.formData = { name: '', email: '', message: '' };
      }
    );
  }
  
  
}
