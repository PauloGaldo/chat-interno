import { Component, OnInit } from '@angular/core';
import { DeepStreamService } from '../../shared/services/deep-stream.service';

@Component({
    selector: 'ci-chat-dashboard',
    templateUrl: './chat-dashboard.component.html',
    styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent implements OnInit {

    private session: any;
    public timeline = [];
    public threads = {};

    constructor(private deepStreamService: DeepStreamService) { }

    ngOnInit() {
        this.session = this.deepStreamService.ds.login();
        const name = 'timeline'

        const list = this.session.record.getList(name);
        this.threads = {
            ...this.threads,
            [name]: { list: list }
        };

        console.log(this.threads);

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
    }

}
