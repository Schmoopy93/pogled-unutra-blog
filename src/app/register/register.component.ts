import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    username: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  onSubmit(): void {
    this.progress.percentage = 0;
    const { username, email, password, firstname, lastname } = this.form;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.authService.register(this.currentFileUpload, username, email, password, firstname, lastname).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        // this.router.navigateByUrl('/', { skipLocationChange: false })
      }
    },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        console.log(this.errorMessage, "err")
      });
    this.selectedFiles = undefined;

  }

}
