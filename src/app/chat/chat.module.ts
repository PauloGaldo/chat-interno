import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChatNavbarComponent } from './chat-navbar/chat-navbar.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FlexLayoutModule
    ],
    declarations: [
        ChatDashboardComponent,
        ChatWindowComponent,
        ChatMessageComponent,
        ChatContactsComponent,
        ChatNavbarComponent
    ],
    exports: [
        ChatDashboardComponent
    ]
})
export class ChatModule { }
