import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceblogService } from '../services/blog-service';
import { User } from '../models/user';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  form: any = {
    text: null,
  }
  currentUser: any;
  user: any;
  userId: any;
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
  role_user:any;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this timeline???'
  public cancelClicked: boolean = false;
  likes:any;
  pageLikes = 1;
  pageSizeLikes = 5;
  pageSizesLikes = [5, 10, 15];
  currentIndexLikes = -1;
  currentLike = null;
  countLikes = 0;
  getLikes: any;
  getEachLike:  any;
  timeline_Id: any;
  likeArrayByTimeline : any = [];
  likeArrayByTimeline1 : any = [];
  toDisplayGroup = {};
  check: any;
  timelineId: any;
  
  constructor(private router: Router, private route: ActivatedRoute, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService, private blogService: ServiceblogService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.currentUser.id);
    this.userId = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
    if(this.currentUser.id === this.userId){
      this.getTimeline();
    }

    this.role_user = JSON.parse(window.sessionStorage.getItem('auth-user')).roles;
  }
  
  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.userId = this.currentUser.id;
    if(this.currentUser.id === this.userId){
      this.getTimelinePage();
    }
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.userId = this.currentUser.id;
    if(this.currentUser.id === this.userId){
      this.getTimelinePage();
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
        console.log(timelines, "timelines")
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
          this.retrieveLikesTimeline();
        }
      },
      error => {
        console.log(error);
      });
  }

  
  retrieveLikesTimeline(): void {
    const params = this.getRequestParamsLikesTimeline(this.pageLikes, this.pageSizeLikes, this.timelineId);
      this.blogService.getLikesByTimelineId(params)
      .subscribe(
        response => {
          const { likes, totalItems } = response;
          this.likes = likes;
          this.countLikes = totalItems;
          this.likeArrayByTimeline.push(...likes)[0];
          //console.log(likes, "likes")
          // this.getLikes = likes.forEach(element => {
          //     this.getEachLike = element
          //     console.log(element);
          //     //this.likeArrayByTimeline.push(this.getEachLike);
          //   });
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
      params[`title`] = searchTitle;
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

  onSubmit(): void {
    const { text } = this.form;
    this.blogService.addTimeline(text, this.currentUser.id).subscribe(
      data => {},
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();

  }

  deleteTimelineById(id) {
    this.blogService.deleteTimeline(id).subscribe(res => {
      this.ngOnInit();
    });
  }

  compareAlphabeticallyAsc() : void {
    this.timelines.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  compareAlphabeticallyDesc(): void {
    this.timelines.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}
