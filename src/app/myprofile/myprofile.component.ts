import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyprofileComponent implements OnInit {
  
  currentUser: any;


  constructor(private router: Router, private route: ActivatedRoute, private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }
  viewBlog() {
    this.router.navigate(['recent-blogs'])
  }
}
