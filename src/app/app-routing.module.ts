import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from './about-me/about-me.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blog/blogdetail/blogdetail.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { ViewblogComponent } from './blog/viewblog/viewblog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

import { MyprofileComponent } from './myprofile/myprofile.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: BlogComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'confirm/:confirmationCode', component: BlogComponent },
      { path: 'login', component: LoginComponent },
      { path: 'my-profile', component: MyprofileComponent },
      {
        path: 'add-blog', component: AddblogComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      {
        path: 'all-users', component: UsersListComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      { path: 'recent-blogs', component: ViewblogComponent },
      { path: 'blogDetail/:id', component: BlogdetailComponent },
      {
        path: 'edit-post/:id', component: EditblogComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      {
        path: 'edit-user/:id', component: UpdateUserComponent
      },
      {
        path: 'about', component: AboutMeComponent
      },
      {
        path: 'appointments', component: AppointmentComponent
      },
      {
        path: 'view-profile/:id', component: ViewProfileComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
      {
        path: 'forgot-password', component: ForgotPasswordComponent
      },
      {
        path: 'reset-password/:token', component: NewPasswordComponent
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
