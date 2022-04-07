import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Appointment } from '../models/appointment';
import { ServiceblogService } from '../services/blog-service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})

export class AppointmentComponent implements OnInit {

  calendarOptions: CalendarOptions;
  error: any;
  events: Appointment;
  appointments = []
  event = {
    title: '',
    userId: '',
    start: '',
  };
  constructor(public http: HttpClient, private blogService: ServiceblogService, private token: TokenStorageService, private Http: HttpClient) {}

  handleDateClick(arg) {
  }

  onSelectx(event) {

  }

  ngOnInit() {
    this.getAllEvents();
    this.getCurrentUser();
 }

  // deleteEvent(id) {
  //   this.apiService.deleteSingleEvent(id).subscribe((data: any) => {});
  // }

  getAllEvents() {
    this.blogService.getAllAppointments().subscribe((data: any) => {
      const self = this;
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        selectable: false,
        editable: false,
        // dateClick: this.handleDateClick.bind(this),
        select: this.handleDateClick.bind(this),
        events: data,
        eventClick(evetData) {
          // tslint:disable-next-line:variable-name
          const event_id = evetData.event.extendedProps.id;
          Swal.fire({
            title: evetData.event.title,
            html: '<p>Check details on the button </p><br><a class="nav-link" href="/my-profile"><i class="fa fa-edit" aria-hidden="true"></i>Check an appointment details...</a> <br> ',
            //icon: 'warning',
            showCancelButton: true,
            // confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            // confirmButtonText: 'Yes, delete it!',
            timer: 30000,
          })    
          // .then((result) => {
          //   if (result.value) {
          //     //self.deleteEvent(event_id);
          //     Swal.fire(
          //       'Deleted!',
          //       'Your file has been deleted.',
          //       'success'
          //     );
          //     self.getAllEvents();
          //   }

          // }
          // ).catch(() => {
          //   Swal.fire('Failed!', 'There was something went wrong.');
          // });
        }
      };
      console.log(data, "dataaaaaaaaaa")
    });
  }

  getCurrentUser(){
    this.event.userId = this.token.getUser().id 
  }

  saveEvent() {
    const event = {
      title: this.event.title,
      userId: this.event.userId,
      start: this.event.start
    };
    this.blogService.addAppointment(event)
      .subscribe();
        window.location.reload();
  }
}