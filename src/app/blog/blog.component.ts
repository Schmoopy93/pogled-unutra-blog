import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { ServiceblogService } from '../services/blog-service';
import counterUp from 'counterup2';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  posts: Post[];
  currentPost = null;
  user: User;
  confirmationCode: string;

  constructor(private blogService: ServiceblogService, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.confirmationCode = this.route.snapshot.params['confirmationCode'];
    if(!this.confirmationCode){
      return;
    }
    this.router.navigate(['/login'], { relativeTo: this.route, replaceUrl: true });
    this.authService.verifyUser(this.confirmationCode)
      .pipe()
      .subscribe({
        next: () => {
          this.router.navigate(['/'], { relativeTo: this.route });
        }
      });
  }
}
