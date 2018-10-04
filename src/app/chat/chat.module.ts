import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DeepStreamService } from '../shared/services/deep-stream.service';
import { SharedModule } from '../shared/shared.module';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { ChatNavbarComponent } from './chat-navbar/chat-navbar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatService } from './services/chat.service';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        FlexLayoutModule
    ],
    declarations: [
        ChatDashboardComponent,
        ChatWindowComponent,
        ChatContactsComponent,
        ChatNavbarComponent
    ],
    exports: [
        ChatDashboardComponent
    ],
    providers: [
        DeepStreamService,
        ChatService
    ]
})
export class ChatModule { }
