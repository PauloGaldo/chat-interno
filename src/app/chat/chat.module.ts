import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ChatDashboardComponent } from './chat-dashboard/chat-dashboard.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        ChatDashboardComponent
    ],
    exports: [
        ChatDashboardComponent
    ]
})
export class ChatModule { }
