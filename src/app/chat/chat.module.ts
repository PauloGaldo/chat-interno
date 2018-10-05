import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { DeepStreamService } from '../shared/services/deep-stream.service';
import { SharedModule } from '../shared/shared.module';
import { ChatBroadcastComponent } from './chat-broadcast/chat-broadcast.component';
import { ChatContactsComponent } from './chat-contacts/chat-contacts.component';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';
import { ChatNavbarComponent } from './chat-navbar/chat-navbar.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { ChatService } from './services/chat.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
        FlexLayoutModule,
        PerfectScrollbarModule
    ],
    declarations: [
        ChatDashboardComponent,
        ChatWindowComponent,
        ChatContactsComponent,
        ChatNavbarComponent,
        ChatBroadcastComponent
    ],
    exports: [
        ChatDashboardComponent
    ],
    providers: [
        DeepStreamService,
        ChatService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    entryComponents: [
        ChatBroadcastComponent
    ]
})
export class ChatModule { }
