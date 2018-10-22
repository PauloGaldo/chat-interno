import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { Message } from '../message.model';
import { ChatService } from '../services/chat.service';


@Component({
    selector: 'ci-chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

    @ViewChild('chatbox') chatbox: PerfectScrollbarComponent;
    @Input() messages: Message[];
    @Output() send: any = new EventEmitter<any>();
    public config: PerfectScrollbarConfigInterface = {};

    public messageForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private deepStreamService: DeepStreamService,
        private chatService: ChatService
    ) {
        this.messageForm = this.formBuilder.group({
            message: '',
            file: ''
        });
    }

    ngOnInit() {
        this.chatbox.directiveRef.scrollToBottom();
    }

    /**
     * Funcion para aplicar clase a un mensaje e identificar si es propio o ajeno
     * @param message mensaje a evaluar
     */
    isUserAuthor(message: Message): string {
      return (message.emisor.username === this.deepStreamService.user.username) ? 'me' : 'them';
    }

    /**
     * Metodo para enviar mensaje
     * @param form formulario de mensajes
     */
    sendMessage(form: FormGroup): void {
        if (form.controls.message.value) {
            const m: Message = {
                id: this.deepStreamService.user.id,
                emisor: this.deepStreamService.user,
                text: form.controls.message.value,
                level: null,
                timestamp: new Date(),
                fileUrl: null,
                read: false,
                status: null,
                fileName: null
            };
            this.send.emit(m);
            this.messageForm.reset();
        }
    }

    /**
     * Metodo para setear imagen
     * @param file Archivo de tipo imagen png/jpg
     */
    uploadFile(file: any) {
        if (file) {
            this.chatService.uploadFile(file).subscribe(response => {
                console.log(response);
                const m: Message = {
                    id: this.deepStreamService.user.id,
                    emisor: this.deepStreamService.user,
                    text: null,
                    level: null,
                    timestamp: new Date(),
                    fileUrl: response.fileDownloadUri,
                    fileName: response.fileName,
                    read: false,
                    status: null
                };
                this.send.emit(m);
                this.messageForm.reset();
            });
        }
    }

}
