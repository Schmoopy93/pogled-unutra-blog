import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
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
  user: any;
  userId: any;
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
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this user???'
  public cancelClicked: boolean = false;
  constructor(private blogService: ServiceblogService, private route : ActivatedRoute, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.route.snapshot.params.id);
    let id = this.route.snapshot.params.id;
    this.userId = id;
    if(id === this.userId){
      this.getTimeline();
    }
    this.route.params.subscribe(params => {
      this.blogService.editTimeline(params.id).subscribe(res => {
        this.user = res;
      });
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
        console.log(response, "res")
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

  deleteTimelineById(id) {
    this.blogService.deleteTimeline(id).subscribe(res => {
      console.log('Deleted');
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
}