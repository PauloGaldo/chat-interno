import { Injectable } from '@angular/core';
import * as deepstream from 'deepstream.io-client-js';

@Injectable({
    providedIn: 'root'
})
export class DeepStreamService {

    public ds: any;
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
    get user(): any {
        return this._user;
    };

    constructor() {
        this.ds = deepstream('localhost:6020');
    }
}
