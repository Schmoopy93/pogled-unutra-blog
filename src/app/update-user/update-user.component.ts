import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})

export class UpdateUserComponent implements OnInit {
  users: User[];
  user: any = {};
  roleAdmin: any;
  roleModerator: any;
  roleUser: any;
  adminId:number;
  currentUser:any;
  userRole: any;
  selectedOptionUser = false;
  selectedOptionModerator= false;
  selectedOptionAdmin= false;
  selectedOptionUserStr: string;
  selectedOptionModeratorStr: string;
  selectedOptionAdminStr: string;
  firstname = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.editUser(params.id).subscribe(res => {
        this.user = res;
        this.adminId = this.route.snapshot.params.id;
        this.currentUser = this.token.getUser().id;
        this.userRole = this.user.roles.map(t =>t.name);
        this.user.roles.forEach(user => {
          if (this.user.roles[0].id === 1) {
            this.selectedOptionUser = this.user.roles[0].id;
            this.selectedOptionUserStr = this.user.roles[0].name;
          } else if (this.user.roles[0].id === 2) {
            this.selectedOptionModerator = this.user.roles[0].id;
            this.selectedOptionModeratorStr = this.user.roles[0].name;
          } else if (this.user.roles[0].id === 3) {
            this.selectedOptionAdmin = this.user.roles[0].id;
            this.selectedOptionAdminStr =  this.user.roles[0].name;
          }
        });
      });
    });
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
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

    return params;
  }

  retrieveUsers(): void {
    const params = this.getRequestParams(this.firstname, this.page, this.pageSize);

    this.authService.getAllUsers(params)
    .subscribe(
      response => {
        const { users, totalItems } = response;
        this.users = users;
        this.count = totalItems;
      },
      error => {
        console.log(error);
      });
  }

  promoteToRole(userId: string, roleId: string): void {
    if (this.user) {
      if (this.selectedOptionUser) {
        this.demoteToUser(userId, roleId);
      } else if (this.selectedOptionModerator) {
        this.promoteToModerator(userId, roleId);
      } else if (this.selectedOptionAdmin) {
        this.promoteToAdmin(userId, roleId);
      } else {
        console.log('No matching role selected.');
      }
    } else {
      console.log('User not found.');
    }
  }
  updateUser(username, phone, adress, town) {
    this.route.params.subscribe(params => {
      this.authService.updateUser(username, phone, adress, town, params.id);
      if(this.currentUser == params.id){
        this.router.navigate(['/my-profile'])
      }
      else{
        this.router.navigate(['/all-users'])
      }
    });
  }

  promoteToAdmin(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.promoteToAdmin(roleId, userId);
      this.router.navigate(['/all-users']).then(() => this.retrieveUsers());
    });
  }

  promoteToModerator(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.promoteToModerator(roleId, userId);
      this.router.navigate(['/all-users']).then(() => this.retrieveUsers());
    });
  }

  demoteToUser(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.demoteToUser(roleId, userId);
      this.router.navigate(['/all-users']).then(() => this.retrieveUsers());
    });
  }

  onCheckboxChange(event) {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const name = checkbox.name;
    if (checked) {
      if (name === 'option1') {
        this.selectedOptionModerator = false;
        this.selectedOptionAdmin = false;
      } else if (name === 'option2') {
        this.selectedOptionUser = false;
        this.selectedOptionAdmin = false;
      } else if (name === 'option3') {
        this.selectedOptionUser = false;
        this.selectedOptionModerator = false;
      }
    }
  }

}
