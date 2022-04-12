import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
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
@Output() mode = new EventEmitter<boolean>();
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router) { }
 

  setDark = false;
  isLoggedIn = false;
  roles: string[] = [];
  isNavbarCollapsed = true;
  _isNavbarCollapsedAnim = 'closed';
  currentUser: any;

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.currentUser = this.tokenStorage.getUser();
  }

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/'])
    .then(() => {
      window.location.reload();
    });
  }

  onChangeToggle() {
    this.setDark = !this.setDark;
    this.mode.emit(this.setDark);
    console.log(this.setDark);
  }
}
