import { Component, OnInit } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Followers } from '../models/followers';
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
  pageSize = 6;
  pageSizes = [6, 12, 18];
  sortedItems: any;
  countAll: any;
  text = '';
  followers: any;
  currentFollower:any;
  check : any;

  constructor(private authService: AuthService) { }


  ngOnInit(): void {
    this.currUser = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
    this.retrieveFollowers();
  }

  setActiveFollower(follower: Followers, index: number): void {
    this.currentFollower = follower;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveFollowers();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveFollowers();
  }

  retrieveFollowers(): void {
    const params = this.getRequestParams(this.text, this.page, this.pageSize, this.currUser);
    this.authService.getMyFollowers(params)
    .subscribe(
      response => {
        const { followers, totalItems } = response;
        this.followers = followers;
        this.count = totalItems;
        //console.log(followers, "follow")
        // for(let i =0; i < followers.length; i++){
        //   this.check = this.followers[i].user;
        //   console.log(this.check, "check")
        // }
        
      },
      error => {
        console.log(error);
      });

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
      params[`userId`] = userId;
    }

    return params;
  }

  // compareAlphabeticallyAsc() : void {
  //   this.check.sort((a, b) => a.firstname.localeCompare(b.firstname))
  // }

  // compareAlphabeticallyDesc(): void {
  //   this.check.sort((a, b) => b.firstname.localeCompare(a.firstname))
  // }

}
