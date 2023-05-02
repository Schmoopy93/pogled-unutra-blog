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
  categories: any;
  errorMessage = '';
  selectedOption: string;
  categoryId: any;

  constructor(private route: ActivatedRoute, private router: Router, private bs: ServiceblogService, private fb: FormBuilder, private blogService: ServiceblogService) {
      this.createForm();
 }

 ngOnInit() {
  this.route.params.subscribe(params => {
      this.bs.editPost(params.id).subscribe(res => {
        this.post = res;
    });
  });
  this.getCategories();
}

  createForm() {
    this.angForm = this.fb.group({
        title: ['', Validators.required ],
        content: ['', Validators.required ],
      });
    }

  getCategories(){
    this.blogService.getAllCategories().subscribe(
      response => {
        this.categories = response;
      },
      error => {
        console.log(error);
      });
  }
 
  onOptionSelect(selectedValue: string) {
    this.categoryId = selectedValue;
    console.log(this.categoryId);
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([currentUrl]));
  }

  updatePost(title, content, categoryId) {
    this.route.params.subscribe(params => {
      console.log(categoryId, 'params')
      this.bs.updatePost(title, content, this.categoryId, params.id);
      this.router.navigate(['/recent-blogs'])
      .then(() => {
        this.refreshPage();
      });
    });
  }



}
