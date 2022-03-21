import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { BlogComponent } from './blog/blog.component';
import { BlogdetailComponent } from './blog/blogdetail/blogdetail.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { ViewblogComponent } from './blog/viewblog/viewblog.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

import { MyprofileComponent } from './myprofile/myprofile.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { UpdateUserComponent } from './update-user/update-user.component';
import { UsersListComponent } from './users-list/users-list.component';


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
        path: 'edit-user/:id', component: UpdateUserComponent, canActivate: [AuthGuard], data: {
          roles: '[ROLE_ADMIN]'
        }
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
