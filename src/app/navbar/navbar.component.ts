import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import {  trigger,state,style, animate, transition } from '@angular/animations'; 
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1'
      })),
      state('closed',   style({
        opacity: '0',
        display: 'none',   
      })),
      transition('closed => open', animate('400ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }

  isLoggedIn = false;
  roles: string[] = [];
  isNavbarCollapsed = true;
  _isNavbarCollapsedAnim = 'closed';

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.onResize(window);
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/'])
    .then(() => {
      window.location.reload();
    });
  }

  @HostListener('window:resize', ['$event.target']) 
  onResize(event) { 
    if(event.innerWidth > 990){
      //need to set this to 'open' for large screens to show up because of opacity in 'closed' animation.
      this._isNavbarCollapsedAnim = 'open';
        this.isNavbarCollapsed = true;
    }else{
      // comment this line if you don't want to collapse the navbar when window is resized.
     // this._isNavbarCollapsedAnim = 'closed';
    }
  }
    toggleNavbar(): void {
      if(this.isNavbarCollapsed){
          this._isNavbarCollapsedAnim = 'open';
        this.isNavbarCollapsed = false;
      } else {
      this._isNavbarCollapsedAnim = 'closed';
        this.isNavbarCollapsed = true;
      }
    }
    get isNavbarCollapsedAnim() : string {
      return this._isNavbarCollapsedAnim;
    }
  }

