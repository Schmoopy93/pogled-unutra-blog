import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import {jsPDF} from 'jspdf';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  public popoverTitle: string = 'WARNING';
  public popoverMessage: string = 'Are you sure you want to delete this user???'
  public cancelClicked: boolean = false;
  users: any;
  currentUser = null;
  user: any = {};
  currentIndex = -1;
  firstname = '';
  searchText: string;
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30];
  sortedItems: any;
  countAll: any;
  currentUser_id: any;
  res: any;
  roles:any;
  exportPdf: any;
  constructor(private authService: AuthService, private token: TokenStorageService , private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.retrieveUsers();
    this.retrieveRoles();
    this.currentUser_id = this.token.getUser().id;
  }


  public onExport() {
    const doc = new jsPDF("l", "pt", "a3");
    const source = document.getElementById("content");
    doc.setFontSize(6)
    doc.html(source, {
      callback: function(pdf) {
        doc.output("dataurlnewwindow"); // preview pdf file when exported
      }
    });
  }

  generatePDF() {
    const url = 'http://localhost:6868/generate-pdf';
    const req = this.http.get(url, { responseType: 'arraybuffer', reportProgress: true, observe: 'events' });

    req.subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        console.log(`Downloaded ${event.loaded} bytes`);
      } else if (event.type === HttpEventType.Response) {
        const blob = new Blob([event.body], { type: 'application/pdf' });
        saveAs(blob, 'user-list.pdf');
      }
    });
  }
  
  
  retrieveRoles(): void {
    this.authService.getRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.log(error)
      });
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
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

  deleteUser(id) {
    this.authService.deleteUser(id).subscribe(res => {
      this.router.navigate(['/all-users']);
      this.ngOnInit();
    });
  }

  compareAlphabeticallyAsc() : void {
    this.users.sort((a, b) => a.firstname.localeCompare(b.firstname))
  }

  compareAlphabeticallyDesc(): void {
    this.users.sort((a, b) => b.firstname.localeCompare(a.firstname))
  }

}
