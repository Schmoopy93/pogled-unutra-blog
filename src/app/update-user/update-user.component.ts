import { Component, OnInit } from '@angular/core';
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
  adminId:number;
  currentUser:any;
  constructor(private authService: AuthService, private route: ActivatedRoute,
    private router: Router, private token: TokenStorageService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.editUser(params.id).subscribe(res => {
        this.user = res;
        this.adminId = this.route.snapshot.params.id;
        this.currentUser = this.token.getUser().id;
        this.roleAdmin = this.user.roles.filter(t=>t.name === "admin")[0];
        this.roleModerator = this.user.roles.filter(t=>t.name === "moderator")[0];
      });
    });
  }
  updateUser(username, phone, adress, town) {
    this.route.params.subscribe(params => {
      this.authService.updateUser(username, phone, adress, town, params.id);
      this.router.navigate(['/my-profile'])
    });
  }

  promoteToAdmin(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.promoteToAdmin(roleId, userId);
      this.router.navigate(['/all-users']).then(() => window.location.reload());
    });
  }

  promoteToModerator(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.promoteToModerator(roleId, userId);
      this.router.navigate(['/all-users']).then(() => window.location.reload());
    });
  }

  demoteToUser(userId, roleId) {
    userId = this.route.snapshot.params.id;
    this.route.params.subscribe(params => {
      this.authService.demoteToUser(roleId, userId);
      this.router.navigate(['/all-users']).then(() => window.location.reload());
    });
  }

}
