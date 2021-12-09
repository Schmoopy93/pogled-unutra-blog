import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { ServiceblogService } from '../services/blog-service';
import counterUp from 'counterup2';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  posts: Post[];
  currentPost = null;

  constructor(private blogService: ServiceblogService) {
  }

  ngOnInit() {
    this.blogService.findAll().subscribe(data => {
      this.posts = data;
    });

    const el = document.querySelector('.counter')
    counterUp(el, {
      duration: 1000,
      delay: 1,
    })
  }

}
