import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceblogService } from 'src/app/services/blog-service';

@Component({
  selector: 'app-editblog',
  templateUrl: './editblog.component.html',
  styleUrls: ['./editblog.component.css']
})
export class EditblogComponent implements OnInit {

  post: any = {};
  angForm: FormGroup;
  form: any = {
    title: null,
    content: null,

  };

  constructor(private route: ActivatedRoute, private router: Router, private bs: ServiceblogService, private fb: FormBuilder) {
      this.createForm();
 }

  createForm() {
    this.angForm = this.fb.group({
        title: ['', Validators.required ],
        content: ['', Validators.required ],
      });
    }

  updatePost(title, content) {
    this.route.params.subscribe(params => {
      this.bs.updatePost(title, content, params.id);
      this.router.navigate(['/recent-blogs'])
      .then(() => {
        window.location.reload();
      });
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
        this.bs.editPost(params.id).subscribe(res => {
          this.post = res;
      });
    });
  }
}
