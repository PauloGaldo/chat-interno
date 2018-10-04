import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { DeepStreamService } from '../../shared/services/deep-stream.service';

@Component({
    selector: 'ci-chat-dashboard',
    templateUrl: './chat-dashboard.component.html',
    styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

    private session: any;
    public timeline = [];
    public systemMessage = '';

    constructor(
        private deepStreamService: DeepStreamService,
        public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.session = this.deepStreamService.ds.login();

        const list = this.session.record.getList('timeline');
        const systemNotification = this.session.record.getList('system-notification');

        list.whenReady(list => {
            // OBTENEMOS MENSAJES
            const entries = list.getEntries();

            for (let i = 0; i < entries.length; i++) {
                this.session.record.getRecord(entries[i]).whenReady(record => {
                    record.subscribe(data => {
                        this.timeline.unshift(data);
                    }, true);
                });
            }
            /** Listen to new entries */
            list.on('entry-added', (recordName) => {
                this.session.record.getRecord(recordName).whenReady(record => {
                    record.subscribe(data => {
                        this.timeline.unshift(data);
                    }, true);
                });
            });
        });

        /** Listen to system-notifications */
        systemNotification.whenReady(notifications => {
            notifications.on('entry-added', (recordName) => {
                this.session.record.getRecord(recordName)
                    .whenReady(record => {
                        console.log('record');
                        console.log(record);
                        record.subscribe(data => {
                            console.log('data');
                            console.log(data);
                            this.snackBar.open(data.content, null, {
                                duration: 2000,
                                verticalPosition: 'top'
                            });
                        }, true);
                    });
            });
        });
    }

    addSystemMessage() {
        const uid = Math.floor(Math.random() * 1000); //temp way for demo
        const recordName = `status/${uid}`; //create a unique record name
        const record = this.session.record.getRecord(recordName);
        console.log('systemMessage');
        console.log(this.systemMessage);
        record.whenReady(message => {
            // data has now been loaded
            message.set({
                author: 'this.user',
                content: 'this.systemMessage'
            });
            const systemNotification = this.session.record.getList('system-notification');
            systemNotification.addEntry(recordName);
            this.systemMessage = '';
        });
    }

}
