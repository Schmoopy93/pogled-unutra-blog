import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Followers } from '../models/followers';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ServiceblogService } from '../services/blog-service';
import { TokenStorageService } from '../services/token-storage.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
})
export class ViewProfileComponent implements OnInit {
  currentUser: any;
  currentUserId: any;
  user: any;
  userId: any;
  followerId: any;
  followRequest = false;
  timelines: any;
  currentTimeline = null;
  currentIndex = -1;
  text = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  sortedItems: any;
  errorMessage = '';
  res: any = {};
  resId: any;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this timeline post???'
  public cancelClicked: boolean = false;
  constructor(private blogService: ServiceblogService, private route : ActivatedRoute, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.route.snapshot.params.id);
    let id = this.route.snapshot.params.id;
    this.followerId = this.route.snapshot.params.id;
    this.currentUserId = this.token.getUser().id;
    this.userId = id;
    if(id === this.userId){
      this.getTimeline();
    }
    this.getFollowing();;
    
  }
  
  getFollowing(): void {
    const params = this.getRequestParamsForFollow(this.followerId,  this.currentUserId);
    this.blogService.getFollows(params)
    .subscribe(
      response => {
        const { followerId, currentUserId } = response;
        this.followerId = followerId;
        this.currentUserId = currentUserId;
        this.res = response;
        if(this.res){
          this.res = this.res.find(i => i.id);
          this.resId = this.res?.id;
        }
        if(typeof response !== 'undefined' && response.length > 0){
          this.followRequest = true;
        }else{
          this.followRequest = false;
        }
      },
      error => {
        console.log(error);
      });
  }

  unfollow(id) {
    this.blogService.unfollow(this.resId).subscribe(res => {
      this.ngOnInit();
    });
  }


  updateTimelineById(text) {
    this.route.params.subscribe(params => {
      this.blogService.updateTimeline(text, params.id);
      //this.router.navigate(['/my-profile'])
    });
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    let id = this.route.snapshot.params.id;
    this.userId = id;
    if(id === this.userId){
      this.getTimeline();
    }
  }
  

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    let id = this.route.snapshot.params.id;
    this.userId = id;
    if(id === this.userId){
      this.getTimeline();
    }
  }


  getUserById(id) {
    this.authService.getUserById(id)
      .subscribe(
        data => {
          this.user = data;
        },
        error => {
          console.log(error);
        });
  }


  getTimeline(): void {
    const params = this.getRequestParams(this.text, this.page, this.pageSize, this.userId);
    this.blogService.getAllTimelines(params)
    .subscribe(
      response => {
        const { timelines, totalItems, userId } = response;
        this.timelines = timelines;
        this.count = totalItems;
        this.userId = userId;
        this.timelines.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      },
      error => {
        console.log(error);
      });
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number, userId: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`text`] = searchTitle;
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

  getRequestParamsForFollow(followerId: number, currentUserId: number): any {
    let params: any = {};

    if (followerId) {
      params[`followerId`] = followerId;
    }

    if (currentUserId) {
      params[`userId`] = currentUserId;
    }

    return params;
  }


  deleteTimelineById(id) {
    this.blogService.deleteTimeline(id).subscribe(res => {
      //this.router.navigate(['/all-users']);
      this.ngOnInit();
    });
  }

  compareAlphabeticallyAsc() : void {
    this.timelines.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  compareAlphabeticallyDesc(): void {
    this.timelines.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  onSubmit(): void {
    this.userId = this.currentUser.id;
    this.followerId = this.route.snapshot.params.id;
    this.blogService.follow(this.userId, this.followerId).subscribe(
      data => {},
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();
  }
}