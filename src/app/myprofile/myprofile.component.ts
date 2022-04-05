import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  
  currentUser: any;
  user: any;
  
  constructor(private router: Router, public _DomSanitizationService: DomSanitizer , private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.getUserById(this.currentUser.id);
  }
  viewBlog() {
    this.router.navigate(['recent-blogs'])
  }

  getUserById(id) {
    this.authService.getUserById(id)
      .subscribe(
        data => {
          this.user = data;
          console.log(data, "dataaaaaa")
        },
        error => {
          console.log(error);
        });
  }
}
