import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  currentUserFollowers : any = {};
  currentUserFollowersList: any = {}
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
  currentUsr: any;
  searchText: string;
  constructor(private authService: AuthService, private token: TokenStorageService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.currUser = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
    this.currentUsr = JSON.parse(window.sessionStorage.getItem('auth-user'));
    this.getUserById(this.currUser);
    this.retrieveUsers();
  }

  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  getUserById(id) {
    this.authService.getUserById(id)
      .subscribe(
        data => {
          this.currentUserFollowers = data;
          this.currentUserFollowersList = this.currentUserFollowers.followers
        },
        error => {
          console.log(error);
        });
  }

  retrieveUsers(): void {
    const params = this.getRequestParams(this.firstname, this.page, this.pageSize, this.currUser);
    this.authService.getAllFilteredUsers(params)
    .subscribe(
      response => {
        const { users, totalItems } = response;
        console.log(response,"RESPONSE")
        this.users = users;
        this.count = totalItems;
        this.users.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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

  getRequestParams(searchTitle: string, page: number, pageSize: number, userId: any): any {
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

    if (userId) {
      params[`id`] = userId;
    }

    return params;
  }

  compareAlphabeticallyAsc() : void {
    this.users.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  compareAlphabeticallyDesc(): void {
    this.users.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

}
