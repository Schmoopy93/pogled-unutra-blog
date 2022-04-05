import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = [];
  currentUser = null;
  user: any = {};
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this user???'
  public cancelClicked: boolean = false;
  currentIndex = -1;
  title = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  sortedItems: any;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  retrieveUsers(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.authService.getAllUsers(params)
    .subscribe(
      response => {
        const { users, totalItems } = response;
        this.users = users;
        this.count = totalItems;
        console.log(this.users, "useeeeeeeers");
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
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  deleteUser(id) {
    this.authService.deleteUser(id).subscribe(res => {
      console.log('Deleted');
      this.router.navigate(['/all-users']).then(() => window.location.reload());
      this.ngOnInit();
    });
  }

}
