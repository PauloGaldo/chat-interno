import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatContactsComponent } from './chat/chat-contacts/chat-contacts.component';
import { ChatDashboardComponent } from './chat/chat-dashboard/chat-dashboard.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { MaterialModule } from './shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
    declarations: [
        AppComponent,
        ChatDashboardComponent,
        ChatWindowComponent,
        ChatContactsComponent,
        ChatMessageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MaterialModule,
        FlexLayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
