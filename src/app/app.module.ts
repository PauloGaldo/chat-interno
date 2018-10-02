import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { ChatDashboardComponent } from './chat/chat-dashboard/chat-dashboard.component';
import { ChatWindowComponent } from './chat/chat-window/chat-window.component';
import { ChatContactComponent } from './chat/chat-contact/chat-contact.component';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatDashboardComponent,
    ChatWindowComponent,
    ChatContactComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
