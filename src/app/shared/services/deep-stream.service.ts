import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as deepstream from 'deepstream.io-client-js';
import { Observable, Subject } from 'rxjs';
import { ChatEntry } from '../../chat/chat-entry.model';

@Injectable()
export class DeepStreamService {

    private systemNotificationSource: Subject<any> = new Subject<any>();
    private chatEntriesSource: Subject<any> = new Subject<any>();
    private _session: any;
    public systemNotificationAnnounced = this.systemNotificationSource.asObservable();
    public chatEntriesAnnounced = this.chatEntriesSource.asObservable();
    public systemNotification: any;
    public chatEntries: ChatEntry[] = [];
    public entries: any;
    public ds: any;

    get user(): any {
        const _user = JSON.parse(localStorage.getItem('user'));
        return _user;
    };

    get session(): any {
        return this._session;
    }

    constructor(private http: HttpClient) {
        this.ds = deepstream('localhost:6020');
        this._session = this.ds.login();
        // MENSAJES DE SISTEMA
        this.systemNotification = this._session.record.getList('system-notification');
        // ENTRADAS DE CHAT
        this.entries = this.session.record.getList(`${this.user.username}-chat-entries`);
        this.entries.whenReady(list => {
            // OBTENEMOS MENSAJES
            const entries = list.getEntries();
            for (let i = 0; i < entries.length; i++) {
                this.session.record.getRecord(entries[i]).whenReady(record => {
                    record.subscribe(data => {
                        this.chatEntries.unshift(data);
                        this.chatEntriesSource.next(this.chatEntries);
                    }, true);
                });
            }
            /** Listen to new entries */
            list.on('entry-added', (recordName) => {
                this.session.record.getRecord(recordName).whenReady(record => {
                    record.subscribe(data => {
                        this.chatEntries.unshift(data);
                        this.chatEntriesSource.next(this.chatEntries);
                    }, true);
                });
            });
        });
    }

    /**
     * Metodo para habilitar las notificaciones de systema desde deepstream
     */
    enableSystemNotification(): void {
        this.systemNotification.whenReady(notifications => {
            notifications.on('entry-added', (recordName) => {
                this._session.record.getRecord(recordName)
                    .whenReady(record => {
                        record.subscribe(data => {
                            this.systemNotificationSource.next(data);
                        }, true);
                    });
            });
        });
    }

    /**
     * Funcion para realizar login de usuario en deepstream
     * @param username nombre de usuario
     * @param token token de aplicacion
     */
    login(username: string, token: string): Observable<any> {
        return this.http.post('', {
            username: username,
            token: token
        });
    }

    /**
     * Metodo para reproducir sonido de notificacion
     */
    playNotificationSound(): void {
        var audio = new Audio('assets/sounds/notification.mp3');
        audio.play();
    }
}
