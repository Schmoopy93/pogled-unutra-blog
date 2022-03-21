import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  users: User[];
  user: any = {};
  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.editUser(params.id).subscribe(res => {
        this.user = res;
    });
  });
  }

    updateUser(username) {
    this.route.params.subscribe(params => {
      this.authService.updateUser(username, params.id);
      alert('You have succesfully changed a username of a User');
      this.router.navigate(['/all-users']);
      
    });
  }

}
