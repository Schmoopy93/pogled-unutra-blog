import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-viewblog',
  templateUrl: './viewblog.component.html',
  styleUrls: ['./viewblog.component.css']
})
export class ViewblogComponent implements OnInit {

  posts: Post[] = [];
  currentPost = null;
  posts$: Observable<Post[]>;
  post: any = {};
  currentUser: any;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;
  currentPosts?: Post;
  currentIndex = -1;
  title = '';
  searchText: string;
  page = 1;
  count = 0;
  pageSize = 6;
  pageSizes = [6, 9, 12];
  sortedItems: any;
  

  constructor(private route: ActivatedRoute, private blogService: ServiceblogService, private token: TokenStorageService, private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.retrievePosts();
    this.route.params.subscribe(params => {
      this.blogService.editPost(params.id).subscribe(res => {
        this.post = res;
      });
    });
    this.currentUser = this.token.getUser();

  }

  deletePost(id) {
    this.blogService.deletePost(id).subscribe(res => {
      this.router.navigate(['/recent-blogs']);
      this.ngOnInit();
    });
  }

  setActivePost(post: Post, index: number): void {
    this.currentPost = post;
    this.currentIndex = index;
  }

  setPostsAsc() : void {
    this.sortedItems = this.posts.sort((a: any, b: any) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  setPostsDesc(): void {
    this.sortedItems = this.posts.sort((a: any, b: any) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  retrievePosts(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.blogService.getAllPosts(params)
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

  searchTitle(): void {
    this.blogService.findByTitle(this.title)
      .subscribe(
        data => {
          this.posts = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
}
