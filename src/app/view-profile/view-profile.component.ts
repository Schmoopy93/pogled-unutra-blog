
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Likes } from '../models/likes';
import { Timeline } from '../models/timeline';
import { AuthService } from '../services/auth.service';
import { ServiceblogService } from '../services/blog-service';
import { TokenStorageService } from '../services/token-storage.service';
import Swal from 'sweetalert2';
import { PhotoGallery } from '../models/photogallery';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
})
export class ViewProfileComponent implements OnInit{
  currentUser: any;
  currentUserId: any;
  user: any;
  userId: any;
  followerId: any;
  followRequest = false;
  requestedFollowing: any;
  timelines: any;
  currentTimeline = null;
  currentIndex = -1;
  text = '';
  page = 1;
  count = 0;
  pageSize = 5;
  pageSizes = [5, 10, 15];
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
  getLikes: any;
  getEachLike:  any;
  timeline_Id: any;
  likeArrayByTimeline : any = [];
  toDisplayGroup = {};
  check: any;
  userRoute: any = {};
  message = '';
  currentUserName: any;
  photoGallery: PhotoGallery[] = [];
  viewMode = 'tab1';
  pageGallery = 1;
  countGallery = 0;
  pageSizeGallery = 6;
  pageSizesGallery = [6, 12, 18];
  photo: any = {};
  searchText: string;
  pageFriends = 1;
  countFriends = 0;
  pageSizeFriends = 6;
  pageSizesFriends = [6, 12, 18];
  firstname = '';
  followers: any;
  currentFollower:any;
  
  constructor(private blogService: ServiceblogService, private router: Router, private route : ActivatedRoute, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.route.snapshot.params.id);
    let id = this.route.snapshot.params.id;
    this.followerId = this.route.snapshot.params.id;
    this.currentUserId = this.token.getUser().id;
    this.userId = id;
    if(id === this.userId){
      this.getTimeline();
      this.getTimelinePage();
      this.retrievePhotoGallery();
    }
    this.retrieveLikesTimeline();
    this.getFollowing();
    this.retrieveFollowers();
    this.getCurrentUser();
    this.route.params.subscribe(params => {
      this.authService.getUserById(params.id).subscribe(res => {
        this.userRoute = res;
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
      });
    });
  }

  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
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
        this.requestedFollowing = this.res.map(e => e.indicator);
        if(this.res){
          this.res = this.res.find(i => i.id);
          this.resId = this.res?.id;
        }
        if(typeof response !== 'undefined' && response.length && this.res.status !== 'Requested'){
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

  setActiveTimeline(timeline: Timeline, index: number): void {
    this.timeline = timeline;
    this.currentIndex = index;
  }
  handlePageChange(event: number, tab: string): void {
    if(tab === 'timelines'){
      let id = this.route.snapshot.params.id;
      this.page = event;
      this.userId = id;
      if(id === this.userId){
        this.getTimelinePage();
      }
      this.retrieveLikesTimeline();
    }
    if(tab === 'photos'){
      let id = this.route.snapshot.params.id;
      this.pageGallery = event;
      this.userId = id;
      if(id === this.userId){
        this.retrievePhotoGallery();
      }
    }
    if(tab === 'friends'){
      let id = this.route.snapshot.params.id;
      this.pageGallery = event;
      this.userId = id;
      if(id === this.userId){
        this.retrieveFollowers();
      }
    }
  }

  handlePageSizeChange(event: any, tab: string): void {
    if(tab === 'timelines'){
      let id = this.route.snapshot.params.id;
      this.pageSize = event.target.value;
      this.page = 1;
      this.userId = id;
      if(id=== this.userId){
        this.getTimelinePage();
      }
      this.retrieveLikesTimeline();
    }
    if(tab === 'photos'){
      let id = this.route.snapshot.params.id;
      this.pageSizeGallery = event.target.value;
      this.pageGallery = 1;
      this.userId = id;
      if(id === this.userId){
        this.retrievePhotoGallery();
      }
    }
    if(tab === 'friends'){
      let id = this.route.snapshot.params.id;
      this.pageSizeGallery = event.target.value;
      this.pageGallery = 1;
      this.userId = id;
      if(id === this.userId){
        this.retrieveFollowers();
      }
    }
  }

  getRequestParamsForFriends(searchTitle: string, pageFriends: number, pageSizeFriends: number, userId: any): any {
    let params: any = {};

    if (searchTitle) {
      params[`firstname`] = searchTitle;
    }

    if (pageFriends) {
      params[`pageFriends`] = pageFriends - 1;
    }

    if (pageSizeFriends) {
      params[`pageSizeFriends`] = pageSizeFriends;
    }
    
    if (userId) {
      params[`userId`] = userId;
    }

    return params;
  }

  retrieveFollowers(): void {
    const params = this.getRequestParamsForFriends(this.firstname, this.pageFriends, this.pageSizeFriends, this.userId);
    this.authService.getMyFollowers(params)
    .subscribe(
      response => {
        const { followers, totalItems } = response;
        this.followers = followers;
        this.count = totalItems;
      },
      error => {
        console.log(error);
      });

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
  getTimelinePage(): void {
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
        // for (let index = 0; index < timelines.length; index++) {
        //   this.timelineId = timelines[index].id;
        //   // this.retrieveLikesTimeline();
        // }
        // return this.timelineId;
      },
      error => {
        console.log(error);
      });

  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  likeTimeline(id): void {
    this.blogService.likeTimeline(this.currentUserLike, id).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
        if(this.errorMessage){
          Swal.fire(this.errorMessage);
        }
      }
    );
    this.ngOnInit()
    //this.reloadCurrentRoute();
  }


  setActiveLikes(like: Likes, index: number): void {
    this.currentLike = like;
    this.currentIndexLikes = index;
  }

  retrieveLikesTimeline(): void {
    this.blogService.getLikesByTimelineId()
      .subscribe({
        next: (data) => {
          this.likes = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }


  // retrieveLikesTimeline(): void {
  //   const params = this.getRequestParamsLikesTimeline(this.pageLikes, this.pageSizeLikes, this.timelineId);
  //     this.blogService.getLikesByTimelineId(params)
  //     .subscribe(
  //       response => {
  //         const { likes, totalItems } = response;
  //         this.likes = likes;
  //         this.countLikes = totalItems;
  //         this.likeArrayByTimeline.push(...likes)[0];
  //         // this.getLikes = likes.forEach(element => {
  //         //     this.getEachLike = element
  //         //     this.likeArrayByTimeline.push(this.getEachLike);
  //         //   });
  //       },
  //       error => {
  //         console.log(error);
  //       });
  //   }


  // getRequestParamsLikesTimeline(pageLikes: number, pageSizeLikes: number, timelineId: number): any {
  //   let params: any = {};

  //   if (pageLikes) {
  //     params[`pageLikes`] = pageLikes - 1;
  //   }

  //   if (pageSizeLikes) {
  //     params[`pageSizeLikes`] = pageSizeLikes;
  //   }

  //   if (timelineId) {
  //     params[`timelineId`] = timelineId;
  //   }
  //   return params;
    
  // }

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
    this.currentUserName = this.token.getUser().firstname + ' ' + this.token.getUser().lastname;
    this.message = this.currentUserName + " sent you a friend request !"
    this.blogService.follow(this.userId, this.followerId, this.message).subscribe(
      data => {
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();
  }

  getRequestParamsForGallery(pageGallery: number, pageSizeGallery: number, userId: any): any {
    let params: any = {};

    if (pageGallery) {
      params[`page`] = pageGallery - 1;
    }

    if (pageSizeGallery) {
      params[`size`] = pageSizeGallery;
    }

    if (userId) {
      params[`userId`] = userId;
    }

    return params;
  }

  retrievePhotoGallery(): void {
    const params = this.getRequestParamsForGallery(this.pageGallery, this.pageSizeGallery, this.userId);
    this.blogService.getAllGallery(params)
    .subscribe(
      response => {
        const { photoGallery, totalItems, userId } = response;
        this.photoGallery = photoGallery;
        this.countGallery = totalItems;
        this.userId = userId;
      },
      error => {
        console.log(error);
      });
  }
}