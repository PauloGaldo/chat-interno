import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { uuid } from '../../shared/utils/uuid';
import { ChatEntry } from '../chat-entry.model';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { Message } from '../message.model';


@Component({
    selector: 'ci-chat-dashboard',
    templateUrl: './chat-dashboard.component.html',
    styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

    @ViewChild('windowChat') windowChat: ChatWindowComponent;
    public timeline: Message[] = [];
    private chat: ChatEntry;
    private list: any;
    private queryParams: Params;
    private recordOfChat: ChatEntry;

    constructor(
        private deepStreamService: DeepStreamService,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.deepStreamService.login('', '').subscribe(response => {
            console.log(response);
        }, error => {
            localStorage.setItem('user', JSON.stringify({
                "id": "DESPBOMLON0",
                "idUsuarioUPD": "admin",
                "username": "usuario2",
                "name": "name2",
                "address": "addres2",
                "station": "station2",
                "agency": "agency2",
                "jurisdiction": "jurisdiction",
                "avatarUrl": "http://placehold.it/32x32"
            }));
            // this.dialog.open(ModalErrorComponent, {
            //     height: '150px',
            //     width: '600px',
            //     closeOnNavigation: false,
            //     disableClose: true,
            //     autoFocus: true,
            //     data: {
            //         error: error,
            //         message: 'No se ha podido iniciar sesión'
            //     }
            // });
        });
    }

    ngOnInit(): void {
        // SNACKBAR CON NOTIFICACIONES DE SISTEMA
        this.deepStreamService.enableSystemNotification();
        this.deepStreamService.systemNotificationAnnounced.subscribe(data => {
            this.snackBar.open(`${data.content.type}: ${data.content.message}`, null, {
                duration: 4000,
                verticalPosition: 'top'
            });
            this.deepStreamService.playNotificationSound();
        });
        this.queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
        this.initChat(this.queryParams['id']);
    }

    /**
     * Metodo para limpiar, cerrar canal anterior de chat y establecer nuevo contacto
     * @param chat contacto de la agenda
     */
    chatChanged(chat: ChatEntry): void {
        if (this.list) {
            this.timeline = [];
            this.chat = chat;
            this.list.discard();
            this.initChat(this.chat.id);
        }
    }

    /**
     * Metodo para suscribirse a un canal y escuchar mensajes
     * @param perfil perfil al cual subscribirse
     */
    initChat(perfil: string) {
        if (perfil) {
            this.list = this.deepStreamService.session.record.getList(perfil);
            this.list.whenReady(list => {
                // OBTENEMOS MENSAJES
                const entries = list.getEntries();

                for (let i = 0; i < entries.length; i++) {
                    this.deepStreamService.session.record.getRecord(entries[i]).whenReady(record => {
                        record.subscribe(data => {
                            this.timeline.unshift(data);
                            setTimeout(() => {
                                this.windowChat.chatbox.directiveRef.scrollToBottom();
                                console.log(this.timeline[0]);
                            }, 200);
                        }, true);
                    });
                }
                /** Listen to new entries */
                list.on('entry-added', (recordName) => {
                    this.deepStreamService.session.record.getRecord(recordName).whenReady(record => {
                        record.subscribe(data => {
                            this.timeline.unshift(data);
                            setTimeout(() => {
                                this.windowChat.chatbox.directiveRef.scrollToBottom();
                                console.log(this.timeline[0]);
                            }, 200);
                        }, true);
                    });
                });
            });
        }
    }

    onSendMessage(value: any): void {
        if (value) {
            this.deepStreamService.entries = this.deepStreamService.session.record.getList(`${this.deepStreamService.user.username}-chat-entries`);
            this.deepStreamService.entries.whenReady(list => {
                // OBTENEMOS MENSAJES
                const entries = list.getEntries();
                for (let i = 0; i < entries.length; i++) {
                    this.deepStreamService.session.record.getRecord(entries[i]).whenReady(record => {
                        record.subscribe(data => {
                            this.processEntryAndMessage(value, data, record);
                        }, true);
                    });
                }
            });
        }
    }

    processEntryAndMessage(value: Message, chatEntry: ChatEntry, record: any) {
        console.log(value, chatEntry, record);
        if (chatEntry.id === this.queryParams['id']) {
            this.recordOfChat = chatEntry;
            record.delete();
            if (this.recordOfChat) {
                this.recordOfChat.lastMessage = value;
                // MENSAJE
                const recordName = `${this.queryParams['id']}/${uuid()}`
                const record = this.deepStreamService.session.record.getRecord(recordName);
                record.whenReady(message => {
                    message.set(value);
                    this.list.addEntry(recordName);
                    record.discard();
                    this.createEntryMessage(this.recordOfChat);
                });
            }
        }
    }

    createEntryMessage(recordOfChat: ChatEntry) {
        const recordEntryChat = recordOfChat.id;
        const recordEntry = this.deepStreamService.session.record.getRecord(recordEntryChat);
        recordEntry.whenReady(message => {
            message.set(this.recordOfChat);
            this.deepStreamService.entries.addEntry(recordEntryChat);
            this.initChat(recordOfChat.id);
        });
    }

}
