import { Injectable } from '@angular/core';
import * as deepstream from 'deepstream.io-client-js';
import { Subject } from 'rxjs';

@Injectable()
export class DeepStreamService {

    private systemNotificationSource: Subject<any> = new Subject<any>();
    private _session: any;
    private _user = {
        idPerfil: 'DESPBOMLON',
        idUsuarioUPD: 'admin',
        perfil: 'BOMBEROS LEON',
        subcentro: {
            idSubCentro: 'LEON',
            idUsuarioUPD: 'Administrador',
            subCentro: 'LEON'
        }
    };
    public systemNotificationAnnounced = this.systemNotificationSource.asObservable();
    public systemNotification: any;
    public ds: any;

    get user(): any {
        const _user = JSON.parse(localStorage.getItem('user'));
        return _user;
    };

    get session(): any {
        return this._session;
    }

    constructor() {
        this.ds = deepstream('localhost:6020');
        this._session = this.ds.login();
        this.systemNotification = this._session.record.getList('system-notification');
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
}
