import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DeepStreamService } from '../../shared/services/deep-stream.service';

@Component({
    selector: 'ci-chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

    @ViewChild('chatbox') chatbox: PerfectScrollbarComponent;
    @Input() messages: any[];
    @Output() send: any = new EventEmitter<any>();
    public config: PerfectScrollbarConfigInterface = {};

    public messageForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private deepStreamService: DeepStreamService) {
        this.messageForm = this.formBuilder.group({
            message: ''
        });
    }

    ngOnInit() {
        this.chatbox.directiveRef.scrollToBottom();
    }

    isUserAuthor(user) {
        console.log(user);
        if (user.author === this.deepStreamService.user.idPerfil) {
            return 'me';
        } else {
            return 'them'
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
                component: this.chatbox
            });
            this.messageForm.reset();
        }
    }

}
