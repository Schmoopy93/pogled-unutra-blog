import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    repeatPassword: null,
    firstname: null,
    lastname: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  erroMessagePswd= '';
  progress: { percentage: number } = { percentage: 0 };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileToReturn: any;
  hasImage: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.hasImage = true;
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
  
    const { username, email, password, repeatPassword, firstname, lastname } = this.form;
  
    if (this.imageChangedEvent) {
      this.authService.register(this.croppedImage, username, email, password, repeatPassword, firstname, lastname).subscribe(
        (response: any) => {
          if (response && response.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * response.loaded / response.total);
          } else if (response instanceof HttpResponse) {
            this.errorMessage = response.body.message;
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }
        },
        (err: any) => {
          this.errorMessage = err.error.message;
          this.erroMessagePswd = err.error.error;
          this.isSignUpFailed = true;
          this.croppedImage = undefined;
          this.fileInput.nativeElement.value = ''; 
        }
      );
      this.imageChangedEvent = undefined;
    }
  }
  
}
