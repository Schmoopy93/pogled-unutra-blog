import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
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
  events: Appointment[];
  event = {
    title: '',
    userId: '',
    start: '',
  };
  completedTasks: any;
  inProgressTasks: any;
  userRole: any;
  isRoleAdmin: boolean = false;
  minDateTime: string = '';

  constructor(private blogService: ServiceblogService, private token: TokenStorageService) {}

  ngOnInit() {
    this.getAllEvents();
    this.getCurrentUser();
    this.userRole = this.token.getUser().roles;
    if(this.userRole.includes('ROLE_ADMIN')) {
      this.isRoleAdmin = true;
    }
    this.setMinDateTime();

   
  }

  handleDateClick(arg) {
  }

    setMinDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log('Min DateTime:', this.minDateTime); // Debugging
  }

  getCurrentUser(){
    this.event.userId = this.token.getUser().id;
  }
  
  saveEvent() {
    const selectedDate = new Date(this.event.start);
    const now = new Date();

    if (selectedDate < now) {
      Swal.fire('Invalid Date', 'The selected date cannot be in the past.', 'error');
      return;
    }

    const newEvent = {
      title: this.event.title,
      userId: this.event.userId,
      start: this.event.start,
      completed: false
    };
    this.blogService.addAppointment(newEvent)
      .subscribe((data) => {
      });
      this.hideModel();
      window.location.reload();

  }
  
  @ViewChild('closeModal') private closeModal: ElementRef;
  public hideModel() {
    this.closeModal.nativeElement.click();
  }

  formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    console.log(date);
    return `${day}.${month}.${year} ${hours}:${minutes}`;


  }

  getAllEvents() {
    this.blogService.getAllAppointments().subscribe((data: any) => {
      const events = data.map((eventData: any) => ({
        id: eventData.id,
        title: eventData.title,
        userId: eventData.userId,
        userFullName: `${eventData.user.firstname} ${eventData.user.lastname}`,
        email: `${eventData.user.email}`,
        start: eventData.start,
        completed: eventData.completed,
        backgroundColor: eventData.completed ? 'green' : 'blue',
      }));
  
      console.log(events); // Provera podataka
      const completedTasks = events.filter((e) => e.completed == true);
      this.completedTasks = completedTasks.length;
      const inProgressTasks = events.filter((e) => e.completed == false);
      this.inProgressTasks = inProgressTasks.length;
      this.events = events;
  
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        selectable: false,
        editable: false,
        select: this.handleDateClick.bind(this),
        events: events,
        eventClick: this.handleEventClick.bind(this),
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }
      };
    });
  }

  handleEventClick(eventData: any): void {
    const event_id = eventData.event.id;
    const formattedDate = this.formatDateTime(new Date(eventData.event.start));
    const userFullName = eventData.event.extendedProps.userFullName
    const email = eventData.event.extendedProps.email;

  
    Swal.fire({
      title: `${userFullName}`,
      showCancelButton: false,
      showConfirmButton: false,
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Description:</strong> ${eventData.event.title}</p>
        <p><strong>Start At:</strong> ${formattedDate}</p>
        ${
          this.token.getUser().roles.includes('ROLE_ADMIN') && eventData.event.backgroundColor !== 'green'
            ? '<button id="markCompletedBtn" class="btn btn-success"><span class="fa fa-check"></span> Mark as Completed</button>'
            : ''
        }
        <button id="deleteBtn" class="btn btn-danger">
          <span class="fa fa-trash"></span> Delete Event
        </button>
      `,
      timer: 30000,
      didOpen: () => {
        const markCompletedBtn = document.getElementById('markCompletedBtn');
        if (markCompletedBtn) {
          markCompletedBtn.addEventListener('click', () => {
            this.markEventAsCompleted(eventData.event.id);
            Swal.fire(
              'Completed!',
              'The event has been marked as completed.',
              'success'
            ).then(() => {
              this.getAllEvents();
              this.refreshEventsAfterCompletion();
            });
          });
        }
  
        const deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.addEventListener('click', () => {
          this.deleteEvent(event_id);
          Swal.fire(
            'Deleted!',
            'The event has been deleted.',
            'success'
          );
        });
      },
    });
  }
    deleteEvent(id) {
    this.blogService.deleteAppointment(id).subscribe(() => {
      this.getAllEvents();
    });
  }

  markEventAsCompleted(eventId: any) {
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].id == eventId) {
        const completedEvent = this.events[i];
        completedEvent.completed = true;
        completedEvent.backgroundColor = 'green';
        this.blogService.updateAppointment(completedEvent).subscribe(() => {
          this.getAllEvents();
        });
        break;
      }
    }
  }
  
  refreshEventsAfterCompletion() {
    const updatedEvents = this.events.map((event: any) => ({
      ...event,
      title: event.title,
      start: event.start,
      backgroundColor: event.completed ? 'green' : 'blue'
    }));
    
    this.calendarOptions.events = updatedEvents;
  }
  

  refreshEvents() {
    const convertedEvents = this.events.map(appointment => ({
      id: appointment.id.toString(),
      title: appointment.title,
      start: appointment.start,
    }));
  
    this.calendarOptions.events = convertedEvents;
  }
  
}
