import { Component, OnInit } from '@angular/core';
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

  posts: Post[];
  currentPost = null;
  posts$: Observable<Post[]>;
  post: any = {};
  currentUser: any;
  sortByDate = posts => posts.sort((a, b) => a.date - b.date);
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;

  constructor(private route: ActivatedRoute, private blogService: ServiceblogService, private token: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.getPosts(); 
    this.route.params.subscribe(params => {
      this.blogService.editPost(params.id).subscribe(res => {
        this.post = res;
      });
    });
    this.currentUser = this.token.getUser();

  }

  getPosts() {
    this.posts$ = this.blogService.findAll();
  }

  deletePost(id) {
    this.blogService.deletePost(id).subscribe(res => {
      console.log('Deleted');
      this.router.navigate(['/recent-blogs']).then(() => window.location.reload());
      this.ngOnInit();
    });
  }

  


  // sortRalliesByDateDesc() {
  //   this.posts$ = this.posts$.pipe(map((posts => posts.sort((x, y) => +new Date(x.createdAt) - +new Date(y.createdAt)))));
  // }
  // sortRalliesByDateAsc() {
  //   this.posts$ = this.posts$.pipe(map((posts => posts.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()))))
  // }

}
