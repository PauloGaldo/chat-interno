import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ci-chat-contacts',
    templateUrl: './chat-contacts.component.html',
    styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {

    public contacts = [];

    constructor() {

        this.contacts.push(
            {
                idPerfil: 'DESPBOMLON0',
                idUsuarioUPD: 'admin',
                perfil: 'BOMBEROS LEON',
                subcentro: {
                    idSubCentro: 'LEON',
                    idUsuarioUPD: 'Administrador',
                    subCentro: 'LEON'
                }
            },
            {
                idPerfil: 'DESPBOMLON1',
                idUsuarioUPD: 'admin',
                perfil: 'BOMBEROS LEON',
                subcentro: {
                    idSubCentro: 'LEON',
                    idUsuarioUPD: 'Administrador',
                    subCentro: 'LEON'
                }
            },
            {
                idPerfil: 'DESPBOMLON2',
                idUsuarioUPD: 'admin',
                perfil: 'BOMBEROS LEON',
                subcentro: {
                    idSubCentro: 'LEON',
                    idUsuarioUPD: 'Administrador',
                    subCentro: 'LEON'
                }
            });
    }

    ngOnInit() {
    }

}
