import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceblogService } from '../services/blog-service';
import { User } from '../models/user';
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { PhotoGallery } from '../models/photogallery';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Followers } from '../models/followers';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from '../services/socket-service';

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
  public popoverMessageGallery: string = 'Are you sure you want to delete this photo???'
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
  checkStatus: any;
  timelineId: any;
  currentUserLike: any;
  currentUserId: any;
  notifications: any;
  res: any = {};
  resId: any;
  countNotification = 0;
  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  formGallery: any = {
    title: null,
  };
  title = '';
  photoGallery: PhotoGallery[] = [];
  viewMode = 'tab1';
  pageGallery = 1;
  countGallery = 0;
  pageSizeGallery = 6;
  pageSizesGallery = [6, 12, 18];
  photo: any = {};
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileToReturn: any;
  errMsg = '';
  firstname = '';
  followers: any;
  currentFollower:any;
  searchText: string;
  pageFriends = 1;
  countFriends = 0;
  pageSizeFriends = 6;
  pageSizesFriends = [6, 12, 18];
  hasImage: boolean = false;
  notificationsInitialized: boolean = false;
  historyNotifications: any;
  viewModeBackToPreviousPage: string;
  historyNotificationsLength: any;
  groupedLikes: { [key: string]: any[] } = {}; 
  currentTimelineId: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private socketService: SocketService, private modalService: NgbModal, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService, private blogService: ServiceblogService) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.currentUserId = this.token.getUser().id;
    this.getUserById(this.currentUser.id);
    this.userId = JSON.parse(window.sessionStorage.getItem('auth-user')).id;
    if(this.currentUser.id === this.userId){
      //this.getTimeline();
      this.getTimelinePage();
      this.retrievePhotoGallery();
    }
    this.retrieveLikesTimeline();
    this.retrieveFollowers();
    this.route.params.subscribe(params => {
      this.blogService.getPhotoById(params.id).subscribe(res => {
        this.photo = res;
      });
    });
    this.role_user = JSON.parse(window.sessionStorage.getItem('auth-user')).roles;
    this.getCurrentUser();
    this.getNotifications();
    this.getNotificationHistory();
    this.socketService.notificationsUpdated.subscribe(() => {
      if (this.socketService.notificationSent == true) {
        this.ngOnInit();
        this.notificationsInitialized == true;
      }
    });
    const storedViewMode = localStorage.getItem('selectedTab');
    this.viewMode = storedViewMode || 'tab1';
  }

  selectTab(tab: string): void {
    this.viewMode = tab;
    localStorage.setItem('selectedTab', tab);
  }

  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
  }

  getCurrentUser(){
    this.currentUserLike = this.token.getUser().id;
  }
  
  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  handlePageChange(event: number, tab: string): void {
    if(tab === 'timelines'){
      this.page = event;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.getTimelinePage();
      }
      this.retrieveLikesTimeline();
    }
    if(tab === 'photos'){
      this.pageGallery = event;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.retrievePhotoGallery();
      }
    }
    if(tab === 'friends'){
      this.pageFriends = event;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.retrieveFollowers();
      }
    }
  }

  handlePageSizeChange(event: any, tab: string): void {
    if(tab === 'timelines'){
      this.pageSize = event.target.value;
      this.page = 1;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.getTimelinePage();
      }
      this.retrieveLikesTimeline();
    }
    if(tab === 'photos'){
      this.pageSizeGallery = event.target.value;
      this.pageGallery = 1;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.retrievePhotoGallery();
      }
    }
    if(tab === 'friends'){
      this.pageSizeFriends = event.target.value;
      this.pageFriends = 1;
      this.userId = this.currentUser.id;
      if(this.currentUser.id === this.userId){
        this.retrieveFollowers();
      }
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
    this.blogService.getAllTimelines(params).subscribe(
      (response) => {
        const { timelines, totalItems, userId } = response;
        this.timelines = timelines;
        this.count = totalItems;
        this.userId = userId;
        this.timelines.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        this.checkValidLikes();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  retrieveLikesTimeline(): void {
    this.blogService.getLikesByTimelineId().subscribe({
      next: (data) => {
        this.likes = data;
        this.groupedLikes = this.groupLikesByTimelineId(this.likes);
        this.checkValidLikes();     
      },
      error: (e) => console.error(e),
    });
  }
  

  checkValidLikes(): void {
    this.timelines.forEach((timeline) => {
      const validLikesForTimeline = this.groupedLikes[timeline.id] || [];
      
      validLikesForTimeline.forEach((like) => {
        if (this.isTimelineLikeValid(like, timeline)) {
          // Do something with valid likes and timeline
        }
      });
    });
  }

  isTimelineLikeValid(like: any, timeline: any): boolean {   
    return like?.timelineId === timeline.id && like?.userId === like?.user.id;
  }

  groupLikesByTimelineId(likes: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    likes.forEach((like) => {
      if (!grouped[like.timelineId]) {
        grouped[like.timelineId] = [];
      }
      grouped[like.timelineId].push(like);
    });

    return grouped;
  }

openLikesModal(timelineId: number): void {
  this.currentTimelineId = timelineId;
  if (!this.groupedLikes[timelineId]) {
    this.blogService.getLikesByTimelineIds(timelineId).subscribe({
      next: (data) => {
        this.groupedLikes[timelineId] = data;
      },
      error: (e) => console.error(e),
    });
  }
}

    getRequestParamsLikesTimeline(pageLikes: number, pageSizeLikes: number): any {
      let params: any = {};
  
      if (pageLikes) {
        params[`pageLikes`] = pageLikes - 1;
      }
  
      if (pageSizeLikes) {
        params[`pageSizeLikes`] = pageSizeLikes;
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

  getRequestParamsForNotifications(page: number, pageSize: number, currentUserId: number): any {
    let params: any = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }
    
    if (currentUserId) {
      params[`followerId`] = currentUserId;
    }

    return params;
  }

  @ViewChild('timelineForm', { static: false }) timelineForm: NgForm;
  resetModalFormTimeline() {
    if (this.timelineForm) {
      this.timelineForm.resetForm();
    }
  }

  onSubmit(): void {
    const { text } = this.form;
    this.blogService.addTimeline(text, this.currentUser.id).subscribe(
      data => {},
      err => {
        this.errorMessage = err.error.message;
      }
    );
    this.resetModalFormTimeline();
    this.ngOnInit();
 

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

  getNotifications(): void {
    const params = this.getRequestParamsForNotifications(this.pageLikes, this.pageSizeLikes,this.currentUserId);
    this.blogService.getNotifications(params)
    .subscribe(
      response => {
        const { followers, totalItems, currentUserId } = response;
        this.currentUserId = currentUserId;
        this.notifications = followers;
        this.checkStatus = this.notifications.filter(e => e.status === 'Requested');
        this.countNotification = totalItems;
      },
      error => {
        console.log(error);
      });
  }


  unfollow(id) {
    this.blogService.unfollow(id).subscribe(res => {
      this.ngOnInit();
    });
  }

  acceptFriendShip(id) {
    this.authService.acceptFriendship(id).subscribe((data) => {
    });
    this.socketService.emitFriendshipAccepted();
    this.ngOnInit();
  }

  getNotificationHistory(){
    const params = this.currentUserId;
    this.blogService.getNotificationsHistory(params)
    .subscribe(
      response => {
        this.historyNotifications = response.rows
        this.historyNotificationsLength = this.historyNotifications.length;
      },
      error => {
        console.log(error);
      });
  }

  deleteHistoryNotificationById(id) {
    this.blogService.deleteHistoryNotificationById(id).subscribe(res => {
      this.ngOnInit();
    });
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

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  addGallery() {
    this.progress.percentage = 0;
    const { title } = this.formGallery;
    const userId = JSON.parse(sessionStorage.getItem('auth-user')).id;
    this.currentFileUpload = this.selectedFiles.item(0);
    this.blogService.addGallery(this.currentFileUpload, title, userId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.ngOnInit();
        this.resetModalFormGallery();
        this.fileInput.nativeElement.value = ''; 
      }
    });
    this.selectedFiles = undefined;
  }

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputChangePhoto') fileInputChangePhoto: ElementRef;
  @ViewChild('fileInputChangePhotoCropped')
  fileInputChangePhotoCropped: ImageCropperComponent;
  @ViewChild('galleryForm', { static: false }) galleryForm: NgForm;
  resetModalFormGallery() {
    if (this.galleryForm) {
      this.galleryForm.resetForm();
    }
  }
  

  deletePhoto(id) {
    this.blogService.deletePhoto(id).subscribe(res => {
      this.router.navigate(['/my-profile']);
      this.ngOnInit();
    });
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.hasImage = true;
    let File = base64ToFile(this.croppedImage);
    this.fileToReturn = this.convertBase64ToFile(event.base64, this.imageChangedEvent.target.files[0].name)
    
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.croppedImage = this.fileToReturn;
    };

    reader.onerror = (event: any) => {
      console.log("File could not be read: " + event.target.error.code);
    };

    reader.readAsDataURL(this.fileToReturn);

    return this.fileToReturn;
  }

  imageLoaded() {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  convertBase64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  @ViewChild('hideModalChangePicture') private hideModalChangePicture: ElementRef;
  public hideModalChangePictureFunc() {
    this.hideModalChangePicture.nativeElement.click();
  }

  public clearFileInputChangePhoto(){
    this.fileInputChangePhoto.nativeElement.value = ''; 
    this.imageChangedEvent = null;
  }

  changeProfilePicture(): void {
    this.progress.percentage = 0;
    const userId = JSON.parse(sessionStorage.getItem('auth-user')).id;
    if (this.imageChangedEvent) {
      this.blogService.changeProfilePicture(this.croppedImage, userId).subscribe(
        (response: any) => {
          if (response && response.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * response.loaded / response.total);
          } else if (response instanceof HttpResponse) {
            this.errorMessage = response.body.message;
            this.hideModalChangePictureFunc();
            this.fileInputChangePhoto.nativeElement.value = ''; 
            this.ngOnInit();
          }
        },
        (err: any) => {
          this.errorMessage = err.error.error;
          this.croppedImage = undefined;
          this.fileInputChangePhoto.nativeElement.value = ''; 
        }
      );
      this.imageChangedEvent = undefined;
    }
  }
}
