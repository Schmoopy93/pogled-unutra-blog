import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import {  trigger,state,style, animate, transition } from '@angular/animations'; 
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
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
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/'])
    .then(() => {
      window.location.reload();
    });
  }
}
