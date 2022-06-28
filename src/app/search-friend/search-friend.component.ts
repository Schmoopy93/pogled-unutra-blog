import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { map } from 'rxjs/operators';
import { LeadingComment } from '@angular/compiler';
@Component({
  selector: 'app-search-friend',
  templateUrl: './search-friend.component.html',
  styleUrls: ['./search-friend.component.css']
})
export class SearchFriendComponent implements OnInit {
  users: User[] = [];
  currentUser:any;
  user: any = {};
  currentIndex = -1;
  firstname = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  sortedItems: any;
  countAll: any;
  currUser: any;
  res: any;
  resFinalArray: any;
  result: any;
  userId:any;
  followerId: any;
  user_Id: any;
  follower_Id: any;
  constructor(private authService: AuthService, private token: TokenStorageService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.retrieveUsers();
    this.currUser = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  retrieveUsers(): void {
    const params = this.getRequestParams(this.firstname, this.page, this.pageSize);
    this.authService.getAllUsersForSearch(params)
    .subscribe(
      response => {
        const { users, totalItems } = response;
        this.users = users;
        this.count = totalItems;
        this.res = users.filter(users => (users.id != this.currUser));
        // for(var i = 0, len = users.length; i < len; i++){
        //   this.resFinalArray = users[i].followers.filter(followers => !(followers.userId != this.currUser));
        //   this.followerId = users[i].followers.map((followers) => followers.followerId);
        //   this.userId = users[i].followers.map((followers) => followers.userId);
        //   this.user_Id = users.map((users) => users.id);
        //   this.follower_Id = users.map((users) => users.id);
          
        // }
        // this.res = users.filter(users => (users.id != this.currUser && (users.id !== this.followerId && users.id !== this.userId)));
        console.log(this.res, "RES")
        },
        error => {
          console.log(error);
        });
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

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`firstname`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  compareAlphabeticallyAsc() : void {
    this.users.sort((a, b) => a.firstname.localeCompare(b.firstname))
  }

  compareAlphabeticallyDesc(): void {
    this.users.sort((a, b) => b.firstname.localeCompare(a.firstname))
  }

}
