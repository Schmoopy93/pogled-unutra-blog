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
  //errorMessage = '';
  message = '';
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
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFileUpload = file;
        this.authService.register(this.currentFileUpload, username, email, password, firstname, lastname).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress.percentage = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.isSuccessful = true;
              this.isSignUpFailed = false;
            }
          },
          (err: any) => {
            this.message = err.error.message;
            this.isSignUpFailed = true;
            this.currentFileUpload = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }
}
