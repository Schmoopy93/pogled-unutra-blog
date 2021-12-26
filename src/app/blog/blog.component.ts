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

  constructor(private blogService: ServiceblogService, private authService: AuthService, private route: ActivatedRoute,
    private router: Router,) {
  }
  
  ngOnInit() {
    const confirmationCode = this.route.snapshot.queryParams['confirmationCode'];

        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.authService.verifyUser(confirmationCode)
            .pipe()
            .subscribe({
                next: () => {
                    //this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                }
            });

    this.blogService.findAll().subscribe(data => {
      this.posts = data;
    });

    const el = document.querySelector('.counter')
    counterUp(el, {
      duration: 1000,
      delay: 1,
    })

    // this.user.isVerified = true;
  }


}
