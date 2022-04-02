import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  
  currentUser: any;
  users: User[];
  constructor(private router: Router, private route: ActivatedRoute, private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUsers();
  }
  viewBlog() {
    this.router.navigate(['recent-blogs'])
  }
  getUsers(){
    this.authService.getUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }
}
