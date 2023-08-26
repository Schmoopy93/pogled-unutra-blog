import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { EventEmitter } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket;
  notifications: any[] = [];
  notificationsUpdated: EventEmitter<any> = new EventEmitter();
  notificationsAccepted: EventEmitter<any> = new EventEmitter();
  notificationSent: boolean = false;
  notificationReceived: boolean = false;
  private friendshipAcceptedCallback: () => void;
  private friendshipAcceptedSource = new Subject<string | void>();
  friendshipAccepted$ = this.friendshipAcceptedSource.asObservable();
  socketMsg: any;

  constructor(private token: TokenStorageService) {
    this.socket = io('http://localhost:4000');

    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    const currentUser = this.token.getUser().id;
    this.socket.on('followerCreated', (data) => {
      const followerId = data.followerId;
      if (followerId === currentUser) {
        this.socket.emit('notifications');
        this.notifications = data.message;
        this.notificationSent = true;
        this.notificationsUpdated.emit();
      }
    });
  }

  emitFriendshipAccepted(): void {
    const friendshipAcceptedHandler = (data) => {
      this.socketMsg = data;
      this.socket.emit('friendshipAccepted');
      this.notificationReceived = true;
      this.notificationsAccepted.emit();
      this.socket.off('friendshipAccepted', friendshipAcceptedHandler);
      this.friendshipAcceptedSource.next();
    };
    this.socket.on('friendshipAccepted', friendshipAcceptedHandler);
  }

  sendNotification(followerId: string, message: string): void {
    this.socket.emit('notification', { followerId, message });
  }
}
