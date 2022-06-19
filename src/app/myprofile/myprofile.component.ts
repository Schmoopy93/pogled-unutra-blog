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
  
  constructor(private router: Router, private route: ActivatedRoute, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService, private blogService: ServiceblogService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.currentUser.id);
    this.userId = this.currentUser.id;
    if(this.currentUser.id === this.userId){
      this.getTimeline();
    }
  }
  
  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.userId = this.currentUser.id;
    if(this.currentUser.id === this.userId){
      this.getTimeline();
    }
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.userId = this.currentUser.id;
    if(this.currentUser.id === this.userId){
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
      },
      error => {
        console.log(error);
      });
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
      data => {
        console.log(data);
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
    window.location.reload();

  }
}
