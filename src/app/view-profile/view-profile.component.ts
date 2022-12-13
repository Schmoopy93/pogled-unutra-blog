import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { getTime } from 'date-fns';
import { Followers } from '../models/followers';
import { Timeline } from '../models/timeline';
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
  timeline:any;
  timelineId: any;
  currentUserLike: any;
  likes:any;
  pageLikes = 1;
  pageSizeLikes = 5;
  pageSizesLikes = [5, 10, 15];
  currentIndexLikes = -1;
  currentLike = null;
  countLikes = 0;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this timeline post???'
  public cancelClicked: boolean = false;
  check: any;
  timeline_Id: any;
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
    this.getFollowing();
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.currentUserLike = this.token.getUser().id;
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

  setActiveTimeline(timeline: Timeline, index: number): void {
    this.timeline = timeline;
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
        this.timeline_Id = this.timelines.map(e => e.id);
        for (let index = 0; index < timelines.length; index++) {
          this.timelineId = timelines[index].id;
          console.log(this.timelineId);
          this.check = this.timeline_Id.includes(this.timelineId)
          if(this.check){
            this.retrieveLikesTimeline();
          }
        }
      },
      error => {
        console.log(error);
      });
  }

  likeTimeline(id): void {
    this.blogService.likeTimeline(this.currentUserLike, this.timeline.id).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      },
    );
    //  if(!this.errorMessage){
    //   window.setTimeout(function(){location.reload()},800)
    //  }
  }

  retrieveLikesTimeline(): void {
    const params = this.getRequestParamsLikesTimeline(this.pageLikes, this.pageSizeLikes, this.timelineId);
      this.blogService.getLikesByTimelineId(params)
      .subscribe(
        response => {
          const { likes, totalItems } = response;
          this.likes = likes;
          this.countLikes = totalItems;
          console.log(response, "LIKES");
        },
        error => {
          console.log(error);
        });
    }


  getRequestParamsLikesTimeline(pageLikes: number, pageSizeLikes: number, timelineId: number): any {
    let params: any = {};

    if (pageLikes) {
      params[`pageLikes`] = pageLikes - 1;
    }

    if (pageSizeLikes) {
      params[`pageSizeLikes`] = pageSizeLikes;
    }

    if (timelineId) {
      params[`timelineId`] = timelineId;
    }
    return params;
    
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