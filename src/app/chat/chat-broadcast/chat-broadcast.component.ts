import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { uuid } from '../../shared/utils/uuid';

@Component({
    selector: 'ci-chat-broadcast',
    templateUrl: './chat-broadcast.component.html',
    styleUrls: ['./chat-broadcast.component.scss']
})
export class ChatBroadcastComponent implements OnInit {

    public systemMessageForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private deepStreamService: DeepStreamService,
        private dialogRef: MatDialogRef<ChatBroadcastComponent>
    ) {
        this.systemMessageForm = this.formBuilder.group({
            message: ['', [Validators.required]],
            type: ['Normal', [Validators.required]]
        });
    }

    ngOnInit() {
    }

    /**
     * Agregar mensaje de sistema
     * @param form formulario de mensaje
     */
    addSystemMessage(form: FormGroup) {
        if (form.valid) {
            const recordName = `status/${uuid()}`
            const record = this.deepStreamService.session.record.getRecord(recordName);
            record.whenReady(message => {
                // data has now been loaded
                message.set({
                    author: this.deepStreamService.user.idPerfil,
                    content: {
                        message: form.controls.message.value,
                        type: form.controls.type.value,
                        datetime: new Date().getTime()
                    }
                });
                const systemNotification = this.deepStreamService.session.record.getList('system-notification');
                systemNotification.addEntry(recordName);
                this.dialogRef.close();
            });
        }
    }

}
