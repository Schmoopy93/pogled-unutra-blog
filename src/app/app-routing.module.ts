import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blog/blogdetail/blogdetail.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { ViewblogComponent } from './blog/viewblog/viewblog.component';
import { EditCommentsComponent } from './edit-comments/edit-comments.component';
import { EditTimelineComponent } from './edit-timeline/edit-timeline.component';
import { FollowersListComponent } from './followers-list/followers-list.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

import { MyprofileComponent } from './myprofile/myprofile.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RegisterComponent } from './register/register.component';
import { SearchFriendComponent } from './search-friend/search-friend.component';
import { AuthGuard } from './services/auth.guard';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { BlogStatisticsComponent } from './blog/blog-statistics/blog-statistics.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: BlogComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'confirm/:confirmationCode', component: BlogComponent },
      { path: 'login', component: LoginComponent },
      { path: 'my-profile', component: MyprofileComponent , canActivate: [AuthGuard]

      },
      {
        path: 'add-blog', component: AddblogComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN, ROLE_MODERATOR]'
        }
      },
      {
        path: 'all-users', component: UsersListComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      { path: 'followers', component: FollowersListComponent , canActivate: [AuthGuard]

       },
      { path: 'recent-blogs', component: ViewblogComponent

      },
      { path: 'blogDetail/:id', component: BlogdetailComponent 

      },
      {
        path: 'edit-post/:id', component: EditblogComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN, ROLE_MODERATOR]'
        }
      },
      {
        path: 'edit-user/:id', component: UpdateUserComponent , canActivate: [AuthGuard]
      },
      {
        path: 'about', component: AboutMeComponent
      },
      {
        path: 'appointments', component: AppointmentComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      {
        path: 'view-profile/:id', component: ViewProfileComponent , canActivate: [AuthGuard]
      },
      {
        path: 'forgot-password', component: ForgotPasswordComponent
      },
      {
        path: 'reset-password/:token', component: NewPasswordComponent , canActivate: [AuthGuard]
      },
      {
        path: 'search-friends', component: SearchFriendComponent , canActivate: [AuthGuard]
      },
      {
        path: 'edit-timeline/:id', component: EditTimelineComponent , canActivate: [AuthGuard]
      },
      {
        path: 'edit-comment/:id', component: EditCommentsComponent , canActivate: [AuthGuard]
      },
      {
        path: 'blog-statistic-chart', component: BlogStatisticsComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      {
        path: 'chat', component: ChatComponent, canActivate: [AuthGuard]
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
