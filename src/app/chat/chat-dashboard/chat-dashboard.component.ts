import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { uuid } from '../../shared/utils/uuid';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { Contact } from "../contact.model";


@Component({
    selector: 'ci-chat-dashboard',
    templateUrl: './chat-dashboard.component.html',
    styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

    @ViewChild('windowChat') windowChat: ChatWindowComponent;
    public timeline = [];
    private contact: Contact;
    private list: any;
    private queryParams: Params;

    constructor(
        private deepStreamService: DeepStreamService,
        private activatedRoute: ActivatedRoute,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {
        this.deepStreamService.login('', '').subscribe(response => {
            console.log(response);
        }, error => {
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
     * @param contact contacto de la agenda
     */
    contactChanged(contact: Contact): void {
        if (this.list) {
            this.timeline = [];
            this.contact = contact;
            this.list.discard();
            this.initChat(this.contact.id);
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
            const recordName = `${this.queryParams['id']}/${uuid()}`
            const record = this.deepStreamService.session.record.getRecord(recordName);
            record.whenReady(message => {
                // data has now been loaded
                message.set({
                    author: this.deepStreamService.user.id,
                    content: value.object ? null : value.text,
                    object: value.object ? value.object : null,
                    datetime: new Date().getTime()
                });
                this.list.addEntry(recordName);
            });
        }
    }

}
