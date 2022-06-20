import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  form: any = {
    password: null,
  };
  errorMessage = '';
  token: string;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.token = this.route.snapshot.params['token'];
    if(!this.token){
    return;
    }
    const { password } = this.form;
    this.authService.setNewPassword(password, this.token)
    .pipe()
    .subscribe({
      next: () => {}
    });
  //Namestiti rutiranje i prikazivanje diva
  //this.router.navigateByUrl('/login', { skipLocationChange: false })
  console.log(this.token);
  console.log(password, "PASS")
  }
}