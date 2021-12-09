import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-blogdetail',
  templateUrl: './blogdetail.component.html',
  styleUrls: ['./blogdetail.component.css']
})
export class BlogdetailComponent implements OnInit {

  posts: Post[];
    currentPost = null;
    currentUser: any;

    constructor(private blogService: ServiceblogService , public sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private token: TokenStorageService) {
    }

    ngOnInit(): void {
        this.getPost(this.route.snapshot.paramMap.get('id'));
        this.currentUser = this.token.getUser();
        

    }

    getPost(id) {
        this.blogService.getPostById(id)
          .subscribe(
            data => {
              this.currentPost = data;
              console.log(data);
            },
            error => {
              console.log(error);
            });
        
          }

}
