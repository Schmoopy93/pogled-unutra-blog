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

  constructor(private blogService: ServiceblogService, private token: TokenStorageService) {}

  ngOnInit() {
    this.getAllEvents();
    this.getCurrentUser();
  }

  handleDateClick(arg) {
  }

  getCurrentUser(){
    this.event.userId = this.token.getUser().id;
  }
  
  saveEvent() {
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
  
  getAllEvents() {
    this.blogService.getAllAppointments().subscribe((data: any) => {
      const self = this;
      const events = data.map((eventData: any) => ({
        id: eventData.id,
        title: eventData.title,
        userId: eventData.userId,
        start: eventData.start,
        completed: eventData.completed,
        backgroundColor: eventData.completed ? 'green' : 'blue'
      }));
      const completedTasks = events.filter(e => e.completed == true);
      this.completedTasks = completedTasks.length;
      const inProgressTasks = events.filter(e => e.completed == false);
      this.inProgressTasks = inProgressTasks.length;
      this.events = events;
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        selectable: false,
        editable: false,
        select: this.handleDateClick.bind(this),
        events: events,
        eventClick(eventData) {
          const event_id = eventData.event.id;
          Swal.fire({
            title: eventData.event.title,
            showCancelButton: false,
            showConfirmButton: false,
            html: `
            ${
              eventData.event.backgroundColor !== 'green'
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
                  self.markEventAsCompleted(eventData.event.id);
                  Swal.fire(
                    'Completed!',
                    'The event has been marked as completed.',
                    'success'
                  ).then(() => {
                    self.getAllEvents();
                    self.refreshEventsAfterCompletion();
                  });
                });
              }
          
              const deleteBtn = document.getElementById('deleteBtn');
              deleteBtn.addEventListener('click', () => {
                self.deleteEvent(event_id);
                Swal.fire(
                  'Completed!',
                  'The event has been deleted.',
                  'success'
                );
              });
            },
          });
          
          
        }
      };
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
