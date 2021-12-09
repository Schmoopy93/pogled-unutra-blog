import { Component, OnInit } from '@angular/core';
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

  errorMessage = '';


  constructor(private blogService: ServiceblogService, private router: Router) { }

  ngOnInit(): void {
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  // onSubmit(): void {
  //   const { title, content } = this.form;

  //   this.blogService.addPost(title, content).subscribe(
  //     data => {
  //       console.log(data);
  //     },
  //     err => {
  //       this.errorMessage = err.error.message;
  //     }
  //   );
  //   this.reloadPage();
  // }

  onSubmit() {
    this.progress.percentage = 0;
    const { title, content } = this.form;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.blogService.addPost(this.currentFileUpload, title, content).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.router.navigateByUrl('/', { skipLocationChange: false }).then(() => {
          window.location.reload();
        });
      }
    });
    this.selectedFiles = undefined;
  }

  reloadPage(): void {
    this.router.navigate(['/recent-blogs']).then(() => window.location.reload());

  }

}
