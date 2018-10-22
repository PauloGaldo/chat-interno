import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { uuid } from '../../shared/utils/uuid';
import { ChatEntry } from '../chat-entry.model';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { Message } from '../message.model';
import { ModalErrorComponent } from 'src/app/shared/modal-error/modal-error.component';


@Component({
  selector: 'ci-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

  @ViewChild('windowChat') windowChat: ChatWindowComponent;
  public chatMessages: Message[] = [];
  private chat: ChatEntry;
  private chatQueue: any;

  constructor(
    private deepStreamService: DeepStreamService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const loginData = JSON.parse(localStorage.getItem('login_data'));
    if (loginData) {
      this.deepStreamService.login(loginData.username, loginData.token).subscribe(
        response => {
          console.log('login:response ===>', response);
          localStorage.setItem('user', JSON.stringify(response));
        }, error => {
          this.launchErrorModal(error);
        });
    } else {
      console.log('No login data in localstorage');
      this.launchErrorModal();
    }
  }

  ngOnInit(): void {
    // SNACKBAR CON NOTIFICACIONES DE SISTEMA
    this.deepStreamService.enableSystemNotification();
    this.deepStreamService.systemNotificationAnnounced.subscribe(
      message => {
        this.snackBar.open(`${message.level}: ${message.text}`, null, {
          duration: 4000,
          verticalPosition: 'top'
        });
        this.deepStreamService.playNotificationSound();
      });
  }

  /**
   * Metodo para limpiar, cerrar canal anterior de chat y establecer nuevo contacto
   * @param chat contacto de la agenda
   */
  chatChanged(chat: ChatEntry): void {
    if (this.chat && chat.id === this.chat.id) {
      return;
    }
    if (this.chatQueue) {
      this.chatQueue.discard();
    }
    if (chat) {
      this.chatMessages = [];
      this.chat = chat;
      this.initChat(this.chat.id);
    }
  }

  /**
   * Metodo para suscribirse a un canal y escuchar mensajes
   * @param perfil perfil al cual subscribirse
   */
  private initChat(chatId: string): void {
    if (chatId) {
      this.chatQueue = this.deepStreamService.session.record.getList(chatId);
      this.chatQueue.whenReady(list => {
        // OBTENEMOS MENSAJES
        const entries = list.getEntries();
        for (let i = 0; i < entries.length; i++) {
          this.deepStreamService.session.record.getRecord(entries[i]).whenReady(record => {
            record.subscribe(data => {
              this.chatMessages.unshift(data);
              setTimeout(() => {
                this.windowChat.chatbox.directiveRef.scrollToBottom();
                console.log(this.chatMessages[0]);
              }, 200);
            }, true);
          });
        }
        // Listen to new entries
        list.on('entry-added', (recordName) => {
          this.deepStreamService.session.record.getRecord(recordName).whenReady(record => {
            record.subscribe(data => {
              this.chatMessages.unshift(data);
              setTimeout(() => {
                this.windowChat.chatbox.directiveRef.scrollToBottom();
                console.log(this.chatMessages[0]);
              }, 200);
            }, true);
          });
        });
      });
    }
  }

  onSendMessage(message: Message): void {
    console.log(message);
    if (message) {
      const recordName = `${this.chat.id}/${uuid()}`;
      const record = this.deepStreamService.session.record.getRecord(recordName);
      record.whenReady(data => {
        // data has now been loaded
        data.set(message);
        this.chatQueue.addEntry(recordName);
      });
    }
    // send update to chat-entry
  }

  private launchErrorModal(error?: any): void {
    this.dialog.open(ModalErrorComponent, {
      height: '150px',
      width: '600px',
      closeOnNavigation: false,
      disableClose: true,
      autoFocus: true,
      data: {
        error: error,
        message: 'No se ha podido iniciar sesión'
      }
    });
  }
}
