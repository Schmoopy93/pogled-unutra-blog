import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit {

  form: any = {
    content: null,
  }
  posts: Post[];
  currentPost = null;
  currentUser: any;
  currentComment = null
  errorMessage = '';
  comments:any;

    constructor(private blogService: ServiceblogService , public sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private token: TokenStorageService) {
    }

    ngOnInit(): void {
        this.getCommentByPost(this.route.snapshot.paramMap.get('id'));
        this.getPost(this.route.snapshot.paramMap.get('id'));
        this.currentUser = this.token.getUser();
        

    }

    getCommentByPost(id) {
      this.blogService.getCommentsByPost(id)
        .subscribe(
          data => {
            this.comments = data;
            console.log(data, "Dataaaaaaaaaaaaaaaa");
          },
          error => {
            console.log(error);
          });
      
}

    getPost(id) {
        this.blogService.getPostById(id)
          .subscribe(
            data => {
              this.currentPost = data;
              //console.log(data);
            },
            error => {
              console.log(error);
            });
        
  }

  onSubmit(): void {
    const { content } = this.form;

    this.blogService.addComment(content).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }


}