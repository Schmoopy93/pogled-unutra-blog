import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceblogService } from 'src/app/services/blog-service';

@Component({
  selector: 'app-editblog',
  templateUrl: './editblog.component.html',
  styleUrls: ['./editblog.component.css']
})
export class EditblogComponent implements OnInit {

  post: any = {};
  form: any = {
    username: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null
  };

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bs: ServiceblogService,
    private fb: FormBuilder) {

  }

  onSubmit() {
    const { title, content } = this.form;
    this.route.params.subscribe(params => {
      this.bs.updatePost(title, content, params.id);
      alert('You have succesfully changed a post!');
      this.router.navigate(['/recent-blogs']);

    });
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.bs.editPost(params.id).subscribe(res => {
        this.post = res;
      });
    });
  } 

}
