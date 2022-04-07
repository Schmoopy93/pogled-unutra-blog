// import {
//   Component,
//   ChangeDetectionStrategy,
//   ViewChild,
//   TemplateRef,
//   OnInit,
// } from '@angular/core';
// import {
//   startOfDay,
//   endOfDay,
//   subDays,
//   addDays,
//   endOfMonth,
//   isSameDay,
//   isSameMonth,
//   addHours,
// } from 'date-fns';
// import { Subject } from 'rxjs';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {
//   CalendarEvent,
//   CalendarEventAction,
//   CalendarEventTimesChangedEvent,
//   CalendarView,
// } from 'angular-calendar';
// import { TokenStorageService } from '../services/token-storage.service';
// import { ServiceblogService } from '../services/blog-service';
// import { Appointment } from '../models/appointment';
// import { ActivatedRoute } from '@angular/router';

// const colors: any = {
//   red: {
//     primary: '#ad2121',
//     secondary: '#FAE3E3',
//   },
//   blue: {
//     primary: '#1e90ff',
//     secondary: '#D1E8FF',
//   },
//   yellow: {
//     primary: '#e3bc08',
//     secondary: '#FDF1BA',
//   },
// };

// @Component({
//   selector: 'app-appointment',
//   templateUrl: './appointment.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   styles: [
//     `
//       h3 {
//         margin: 0 0 10px;
//       }

//       pre {
//         background-color: #f5f5f5;
//         padding: 15px;
//       }
//     `,
//   ],
// })
// export class AppointmentComponent implements OnInit {
//   form: any = {
//     content: null,
//   }
// currentUser = null;
// errorMessage = '';
// isLoggedIn = false;
// appointments: any;
// constructor(private modal: NgbModal,  private token: TokenStorageService, private blogService: ServiceblogService, private route: ActivatedRoute) {}
 
//   ngOnInit(): void {
//     this.getCurrentUser();
//     if (this.token.getToken()) {
//       this.isLoggedIn = true;
//     }
//     this.getAllAppointments();
//   }

//   @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

//   view: CalendarView = CalendarView.Month;

//   CalendarView = CalendarView;

//   viewDate: Date = new Date();

//   modalData: {
//     action: string;
//     event: CalendarEvent;
//   };

//   actions: CalendarEventAction[] = [
//     {
//       label: '<i class="fas fa-fw fa-pencil-alt"></i>',
//       a11yLabel: 'Edit',
//       onClick: ({ event }: { event: CalendarEvent }): void => {
//         this.handleEvent('Edited', event);
//       },
//     },
//     {
//       label: '<i class="fas fa-fw fa-trash-alt"></i>',
//       a11yLabel: 'Delete',
//       onClick: ({ event }: { event: CalendarEvent }): void => {
//         this.events = this.events.filter((iEvent) => iEvent !== event);
//         this.handleEvent('Deleted', event);
//       },
//     },
//   ];

//   refresh = new Subject<void>();

//   events: CalendarEvent[] = [];

//   activeDayIsOpen: boolean = true;



//   dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
//     if (isSameMonth(date, this.viewDate)) {
//       if (
//         (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
//         events.length === 0
//       ) {
//         this.activeDayIsOpen = false;
//       } else {
//         this.activeDayIsOpen = true;
//       }
//       this.viewDate = date;
//     }
//   }

//   eventTimesChanged({
//     event,
//     newStart,
//     newEnd,
//   }: CalendarEventTimesChangedEvent): void {
//     this.events = this.events.map((iEvent) => {
//       if (iEvent === event) {
//         return {
//           ...event,
//           start: newStart,
//           end: newEnd,
//         };
//       }
//       return iEvent;
//     });
//     this.handleEvent('Dropped or resized', event);
//   }

//   handleEvent(action: string, event: CalendarEvent): void {
//     this.modalData = { event, action };
//     this.modal.open(this.modalContent, { size: 'lg' });
//   }

//   onSubmit(): void {
//     const { content } = this.form;
//     this.blogService.addAppointment(content, this.currentUser).subscribe(
//       data => {
//         console.log(data);
//       },
//       err => {
//         this.errorMessage = err.error.message;
//       }
//     );
//     //window.location.reload();

//   }

//   getAllAppointments(): void {
//     this.blogService.getAllAppointments()
//       .subscribe(
//         data => {
//           this.appointments = data;
//           console.log(data, "dataaaaaaaaaaa");
//         },
//         error => {
//           console.log(error);
//         });
//   }

//   // getAppointmentByUser(id) {
//   //   this.blogService.getAppointmentByUser(id)
//   //     .subscribe(
//   //       data => {
//   //         this.appointments = data;
//   //         console.log(data, "dataaaaaaaaa")

//   //       },
//   //       error => {
//   //         console.log(error);
//   //       });

//   // }


//   getCurrentUser(){
//     this.currentUser = this.token.getUser().id
//     console.log(this.currentUser, "CRUSER")

//   }

//   deleteEvent(eventToDelete: CalendarEvent) {
//     this.events = this.events.filter((event) => event !== eventToDelete);
//   }

//   setView(view: CalendarView) {
//     this.view = view;
//   }

//   closeOpenMonthViewDay() {
//     this.activeDayIsOpen = false;
//   }
// }


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
  event = {
    content: '',
    userId: '',
    date: '',
  };
  constructor(
    public http: HttpClient,
    private blogService: ServiceblogService,
    private token: TokenStorageService
  ) {}

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
          const event_id = evetData.event._def.extendedProps._id;
          Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            timer: 30000,
          }).then((result) => {
            if (result.value) {
              //self.deleteEvent(event_id);
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              );
              self.getAllEvents();
            }

          }).catch(() => {
            Swal.fire('Failed!', 'There was something went wrong.');
          });
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
      content: this.event.content,
      userId: this.event.userId,
      date: this.event.date
    };
    this.blogService.addAppointment(event)
      .subscribe(
        (response: any) => {
          if (response.type === 'success') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Your Event has been added successfully',
              showConfirmButton: false,
              timer: 1500
            });
            //this.router.navigate(['/calendar']);
          }
        },
        err => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Something went wrong',
            showConfirmButton: false,
            timer: 1500
          });
          this.event.content = '';
          //this.event.date = '';
        });
        window.location.reload();
  }
}