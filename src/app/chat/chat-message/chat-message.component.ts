import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'ci-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() message: any;
  currentUser: any;
  incoming: boolean;

  constructor(public usersService: UsersService) { }

  ngOnInit() {
    this.usersService.currentUser
      .subscribe(
        (user: any) => {
          this.currentUser = user;
          if (this.message.author && user) {
            this.incoming = this.message.author.id !== user.id;
          }
        });
  }

}
