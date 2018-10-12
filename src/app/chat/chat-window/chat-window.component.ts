import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { ChatService } from '../services/chat.service';
import { Message } from "../message.model";


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

    isUserAuthor(user) {
        if (user.author === this.deepStreamService.user.idPerfil) {
            return 'me';
        } else {
            return 'them';
        }
    }

    /**
     * Metodo para enviar mensaje
     * @param form formulario de mensajes
     */
    sendMessage(form: FormGroup): void {
        if (form.controls.message.value) {
            this.send.emit({
                text: form.controls.message.value,
                emisor: this.deepStreamService.user,
                timestamp: new Date().getTime()
            });
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
                this.send.emit({
                    text: '',
                    object: response,
                    datetime: new Date().getTime()
                });
                this.messageForm.reset();
            });
        }
    }

}
