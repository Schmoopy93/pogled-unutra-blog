import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { ServiceblogService } from 'src/app/services/blog-service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-addblog',
  templateUrl: './addblog.component.html',
  styleUrls: ['./addblog.component.css']
})
export class AddblogComponent implements OnInit {

  posts: Post[];
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  form: any = {
    title: null,
    content: null,

  };

  formCategory: any ={
    text: null
  }
  categories: any;

  errorMessage = '';
  selectedOption: string;
  categoryId: any;


  constructor(private blogService: ServiceblogService, private router: Router) { }

  ngOnInit(): void {
    this.getCategories();
    
  }

  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
  }


  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
  onSubmit() {
    this.progress.percentage = 0;
    const { title, content } = this.form;
    const userId = JSON.parse(sessionStorage.getItem('auth-user')).id;
    

    this.currentFileUpload = this.selectedFiles.item(0);
    this.blogService.addPost(this.currentFileUpload, title, content, userId, this.categoryId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.router.navigateByUrl('/recent-blogs', { skipLocationChange: false })
      }
    });
    this.selectedFiles = undefined;
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

  onSubmitCategory(): void {
    const { text } = this.formCategory;
    this.blogService.addCategory(text).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    this.hideModel();
    //this.commentForm.form.reset();
    location.reload();
  }

}
