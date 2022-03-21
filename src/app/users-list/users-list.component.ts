import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[];
  user: any = {};
  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
    this.route.params.subscribe(params => {
      this.authService.editUser(params.id).subscribe(res => {
        this.user = res;
    });
  });
  }

  getUsers(){
    this.authService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      console.log(data, "dataaaaaaaaaaa");
    });

  }
  // updateUser(username) {
  //   this.route.params.subscribe(params => {
  //     this.authService.updateUser(username, params.id);
  //     alert('You have succesfully changed a username of a User');
  //     this.router.navigate(['/recent-blogs']);
      
  //   });
  // }
}
