import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SocketService } from '../services/socket-service';
import { Socket } from 'socket.io-client';
import { distinctUntilChanged, take  } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;
  apiUrl = environment.apiUrl;
  followers: any[] = []; 
  messages: any[] = []; 
  messageText: string = '';
  currentChatUser: string = '';
  firstname = '';
  searchText: string;
  pageFriends = 1;
  countFriends = 0;
  countMessages = 0;
  pageSizeFriends = 6;
  pageSizesFriends = [6, 12, 18];
  userId: any;
  socket: Socket;
  userStatus: { [userId: string]: string } = {};
  userStatusSubscription: Subscription;
  currentUser:any;

  constructor(private authService: AuthService, private socketService: SocketService, private cdr: ChangeDetectorRef) {
    this.socket = this.socketService.socket;
   }

  ngOnInit(): void {
    this.userId = JSON.parse(sessionStorage.getItem('auth-user')).id;
    this.currentUser =JSON.parse(sessionStorage.getItem('auth-user'));
    this.getFollowers();
    this.subscribeToUserStatus();
    this.socketService.receiveNewMessage().subscribe(
      (message) => {
        this.messages.push(message);
        this.getMessages();
      },
      (error) => {
        console.error('Error receiving message:', error);
      }
    );
  this.socketService.subscribeToUserStatus();
  }

  subscribeToUserStatus(): void {
    this.socketService.userStatus$
    .pipe(distinctUntilChanged())
    .subscribe((userStatus) => {
      this.userStatus = userStatus;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  
  ngOnDestroy() {
    this.socketService.socket.emit('userDisconnected', this.userId);
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  getStatusColor(userId: string): string {
    const status = this.userStatus[userId];
    return status === 'online' ? 'green' : 'gray';
  }

  getRequestParamsForFriends(searchTitle: string, pageFriends: number, pageSizeFriends: number, userId: any): any {
    let params: any = {};

    if (searchTitle) {
      params[`firstname`] = searchTitle;
    }

    if (pageFriends) {
      params[`pageFriends`] = pageFriends - 1;
    }

    if (pageSizeFriends) {
      params[`pageSizeFriends`] = pageSizeFriends;
    }
    
    if (userId) {
      params[`userId`] = userId;
    }

    return params;
  }

  getFollowers(): void {
    const params = this.getRequestParamsForFriends(this.firstname, this.pageFriends, this.pageSizeFriends, this.userId);
    this.authService.getMyFollowers(params)
    .subscribe(
      response => {
        const { followers, totalItems } = response;
        this.followers = followers;
        
        this.countFriends = totalItems;
      },
      error => {
        console.log(error);
      });

  }

  sendMessage(): void {
    const senderId = this.userId;
    const receiverId = this.currentChatUser;
    const text = this.messageText;

    const messageData = { senderId, receiverId, text };
    this.socketService.sendMessage(messageData);

    const newMessage = {
        sender: {
            id: senderId,
            firstname: this.currentUser.firstname,
            lastname: this.currentUser.lastname,
            photoName: this.currentUser.photoName
        },
        text: text,
        createdAt: new Date()
    };
    this.messages.push(newMessage);

    this.messageText = '';
}


  getMessages(): void {
    const senderId = this.userId;
    const receiverId = this.currentChatUser;
    const params = { senderId, receiverId };
    this.authService.getMessages(params)
    .subscribe(
      response => {
        const { messages, totalItems } = response;
        this.messages = messages;
        this.countMessages = totalItems;
      },
      error => {
        console.log(error);
      });

  }

  selectUser(receiverId: string): void {
    this.currentChatUser = receiverId;
    this.getMessages();
  }
}
