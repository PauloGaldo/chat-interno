import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { uuid } from '../../shared/utils/uuid';

@Component({
    selector: 'ci-chat-dashboard',
    templateUrl: './chat-dashboard.component.html',
    styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit, OnChanges {

    public timeline = [];
    public systemMessageForm: FormGroup;
    private contact: any;
    private list: any;
    private queryParams: Params;

    constructor(
        private deepStreamService: DeepStreamService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute
    ) {
        this.systemMessageForm = this.formBuilder.group({
            message: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        // SNACKBAR CON NOTIFICACIONES DE SISTEMA
        this.deepStreamService.enableSystemNotification();
        this.deepStreamService.systemNotificationAnnounced.subscribe(data => {
            this.snackBar.open(data.content, null, {
                duration: 2000,
                verticalPosition: 'top'
            });
        });
        this.queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
        this.initChat(this.queryParams['id']);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.contact) {
            // this.initChat(this.contact.idPerfil);
        }
    }

    addSystemMessage(form: FormGroup) {
        if (form.valid) {
            const recordName = `status/${uuid()}`
            const record = this.deepStreamService.session.record.getRecord(recordName);
            record.whenReady(message => {
                // data has now been loaded
                message.set({
                    author: this.deepStreamService.user.idPerfil,
                    content: form.controls.message.value
                });
                const systemNotification = this.deepStreamService.session.record.getList('system-notification');
                systemNotification.addEntry(recordName);
            });
        }
    }

    /**
     * Metodo para limpiar, cerrar canal anterior de chat y establecer nuevo contacto
     * @param contact contacto de la agenda
     */
    contactChanged(contact: any): void {
        if (this.list) {
            this.timeline = [];
            this.contact = contact;
            this.list.discard();
            this.initChat(this.contact.idPerfil);
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
                            console.log(data);
                            this.timeline.unshift(data);
                        }, true);
                    });
                }
                /** Listen to new entries */
                list.on('entry-added', (recordName) => {
                    this.deepStreamService.session.record.getRecord(recordName).whenReady(record => {
                        record.subscribe(data => {
                            this.timeline.unshift(data);
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
                    author: this.deepStreamService.user.idPerfil,
                    content: value.text
                });
                this.list.addEntry(recordName);
                value.component.directiveRef.scrollToBottom();
            });
        }
    }

}
