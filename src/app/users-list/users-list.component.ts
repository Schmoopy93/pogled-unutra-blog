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
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this post???'
  public cancelClicked: boolean = false;
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(){
    this.authService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  deleteUser(id) {
    this.authService.deleteUser(id).subscribe(res => {
      console.log('Deleted');
      this.router.navigate(['/all-users']).then(() => window.location.reload());
      this.ngOnInit();
    });
  }

}
