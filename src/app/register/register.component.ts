import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';

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
  message = '';
  progress: { percentage: number } = { percentage: 0 };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileToReturn: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    let File = base64ToFile(this.croppedImage);
    this.fileToReturn = this.convertBase64ToFile(event.base64, this.imageChangedEvent.target.files[0].name)
    
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.croppedImage = this.fileToReturn;
    };

    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(this.fileToReturn);

    return this.fileToReturn;
  }

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  convertBase64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  
  onSubmit(): void {
    this.progress.percentage = 0;
      const { username, email, password, firstname, lastname } = this.form;
      if (this.imageChangedEvent) {
        this.authService.register(this.croppedImage, username, email, password, firstname, lastname).subscribe(
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
            this.croppedImage = undefined;
          });
      this.imageChangedEvent = undefined;
    }
  }
}
