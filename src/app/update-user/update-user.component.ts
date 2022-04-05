import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  users: User[];
  user: any = {};
  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.editUser(params.id).subscribe(res => {
        this.user = res;
    });
  });
  }

    updateUser(username, phone, adress, town) {
    this.route.params.subscribe(params => {
      this.authService.updateUser(username, phone, adress, town, params.id);
      this.router.navigate(['/my-profile'])
    });
  }

}
