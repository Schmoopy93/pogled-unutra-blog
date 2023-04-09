import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceblogService } from '../services/blog-service';

@Component({
  selector: 'app-edit-comments',
  templateUrl: './edit-comments.component.html',
  styleUrls: ['./edit-comments.component.css']
})
export class EditCommentsComponent implements OnInit {

  comment: any = {};
  postId: any;
  constructor(private blogService: ServiceblogService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.blogService.editComment(params.id).subscribe(res => {
        this.comment = res;
        this.postId = this.comment.postId;
      });
    });
  }

  updateCommentById(content) {
    this.route.params.subscribe(params => {
      this.blogService.updateCommentById(content, params.id);
      this.router.navigate(['/blogDetail/' + this.postId])
    });
  }
}