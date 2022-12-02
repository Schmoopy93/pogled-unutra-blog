import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-followers-list',
  templateUrl: './followers-list.component.html',
  styleUrls: ['./followers-list.component.css']
})
export class FollowersListComponent implements OnInit {

  users :any;
  currUser :string;
  currentIndex = -1;
  firstname = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  sortedItems: any;
  countAll: any;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.currUser = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
    this.retrieveUsers();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveUsers();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.authService.getUsers()
    .subscribe(
      response => {
        const res   = response;
        const allUsers = res['users'] || undefined;

        const currentUserFollowers = allUsers.filter(user => user.id === this.currUser)[0].followers.map(el => el.followerId);
        
        this.users = allUsers.filter(user => (currentUserFollowers.includes(user.id) && user.id !==this.currUser));

        },
        error => {
          console.log(error);
        });
  }

}
