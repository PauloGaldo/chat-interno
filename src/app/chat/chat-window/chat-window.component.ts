import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'ci-chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

    @Input() messages: any[];
    @Output() send: any = new EventEmitter<any>();

    public messageForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.messageForm = this.formBuilder.group({
            message: ''
        });
    }

    ngOnInit() {
    }

    /**
     * Metodo para enviar mensaje
     * @param form formulario de mensajes
     */
    sendMessage(form: FormGroup): void {
        if (form.controls.message.value) {
            this.send.emit(form.controls.message.value);
            this.messageForm.reset();
        }
    }

}
