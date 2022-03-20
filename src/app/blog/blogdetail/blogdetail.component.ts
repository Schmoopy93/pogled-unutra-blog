import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { ServiceblogService } from 'src/app/services/blog-service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  comments: any;
  user = null;
  closeResult = '';

  constructor(private blogService: ServiceblogService, private authService: AuthService, public sanitizer: DomSanitizer,
    private router: Router, private route: ActivatedRoute, private token: TokenStorageService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.getCommentByPost(this.route.snapshot.paramMap.get('id'));
    this.getPost(this.route.snapshot.paramMap.get('id'));
    //this.currentUser = this.token.getUser();
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
    window.location.reload();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}