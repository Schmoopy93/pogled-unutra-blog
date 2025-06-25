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
  selectedFiles: FileList;
  progress = { percentage: 0 };

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
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([currentUrl]));
  }

  updatePost(title, content, categoryId) {
    this.route.params.subscribe(params => {
      const userId = JSON.parse(sessionStorage.getItem('auth-user')).id;
      const file = this.selectedFiles && this.selectedFiles.length > 0 ? this.selectedFiles.item(0) : null;
      categoryId = this.categoryId || this.post.category?.id;
      this.progress.percentage = 0;

      this.bs.updatePost(file, title, content, userId, categoryId, params.id).subscribe(
        event => {
          if (event.type && event.type === 1 && event.total) {
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
          } else if (event.body || event.type === 4) {
            this.router.navigate(['/recent-blogs']);
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }

    selectFile(event) {
      this.selectedFiles = event.target.files;
    }



}
