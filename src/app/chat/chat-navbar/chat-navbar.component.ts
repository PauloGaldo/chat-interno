import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChatBroadcastComponent } from '../chat-broadcast/chat-broadcast.component';

@Component({
    selector: 'ci-chat-navbar',
    templateUrl: './chat-navbar.component.html',
    styleUrls: ['./chat-navbar.component.scss']
})
export class ChatNavbarComponent implements OnInit {

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openBroadcast(): void {
        const unitManager = this.dialog.open(ChatBroadcastComponent, {
            width: `${600}px`,
            height: `${220}px`,
            data: {}
        });
    }


}
