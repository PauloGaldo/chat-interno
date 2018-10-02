import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { ChatWindowsComponent } from './chat-windows/chat-windows.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatContactComponent } from './chat-contact/chat-contact.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        ChatDashboardComponent,
        ChatWindowsComponent,
        ChatWindowComponent,
        ChatContactComponent,
        ChatMessageComponent
    ],
    exports: [
        ChatDashboardComponent
    ]
})
export class ChatModule { }
