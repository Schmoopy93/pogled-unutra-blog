import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: any = {
    email: "",
  };
  errorMessage = '';
  isSuccessful = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { email } = this.form;
    this.authService.forgotPassword(email).subscribe(
      data => {
        this.isSuccessful = true;
      },
      err => {
        this.errorMessage = err.error.message;
       
      }
    );
    this.isSuccessful = true;
  }

}
