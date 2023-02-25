import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { ServiceblogService } from '../services/blog-service';
import counterUp from 'counterup2';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  
}
