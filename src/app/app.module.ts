import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ConfirmationPopoverModule} from 'angular-confirmation-popover'
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { BlogComponent } from './blog/blog.component';
import { AddblogComponent } from './blog/addblog/addblog.component';
import { ViewblogComponent } from './blog/viewblog/viewblog.component';
import { BlogdetailComponent } from './blog/blogdetail/blogdetail.component';
import { EditblogComponent } from './blog/editblog/editblog.component';
import { DatePipe } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule } from 'ngx-pagination';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { SearchFriendComponent } from './search-friend/search-friend.component';
import { FollowersListComponent } from './followers-list/followers-list.component';
import { EditTimelineComponent } from './edit-timeline/edit-timeline.component';
import { EditCommentsComponent } from './edit-comments/edit-comments.component';
import { SearchPipe } from './services/search.pipe';
import { ChartsModule } from 'ng2-charts';
import { BlogStatisticsComponent } from './blog/blog-statistics/blog-statistics.component';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    MyprofileComponent,
    BlogComponent,
    AddblogComponent,
    ViewblogComponent,
    BlogdetailComponent,
    EditblogComponent,
    UsersListComponent,
    UpdateUserComponent,
    AboutMeComponent,
    ViewProfileComponent,
    AppointmentComponent,
    ForgotPasswordComponent,
    NewPasswordComponent,
    SearchFriendComponent,
    FollowersListComponent,
    EditTimelineComponent,
    EditCommentsComponent,
    SearchPipe,
    BlogStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxPaginationModule,
    MDBBootstrapModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    }),
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FullCalendarModule,
    ChartsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
