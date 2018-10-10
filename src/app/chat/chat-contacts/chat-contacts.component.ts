import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
    selector: 'ci-chat-contacts',
    templateUrl: './chat-contacts.component.html',
    styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {

    @Output() changed: any = new EventEmitter<any>();
    public contacts = [];
    public chats = [];
    public activeContact: any;
    public tabs = [];
    public selected;

        constructor(
            private activatedRoute: ActivatedRoute,
            private router: Router,
            private chatService: ChatService
        ) {
    // CARGAR MOCK DE CONTACTOS
    this.chatService.getContactList().subscribe(response => {
        this.contacts = response.data;
    });

    // CARGAR MOCK DE CHATS
    this.chatService.getMessagesList().subscribe(response => {
        this.chats = response.data;
    });
}

ngOnInit() {
}

/**
 * Funcion para determinar que contacto esta activo del listado
 * @param contact contacto del listado
 */
isContactActive(contact: any): boolean {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    if (contact.idPerfil === queryParams['id']) {
        this.activeContact = contact;
        return true;
    }
    return false;
}

/**
 * Metodo para seleccionar y poner activo un contacto del listado
 * @param contact contacto del listado
 */
selectContact(contact: any): void {
    if (contact) {
        this.activeContact = contact;
        const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
        queryParams['id'] = contact.idPerfil;
        this.router.navigate(['.'], { queryParams: queryParams });
        this.changed.emit(contact);
    }
}
// agregar tab
addTab() {
    this.tabs.push('New');
    this.selected.setValue(this.tabs.length - 1);
}
 // eliminar tab
removeTab(index: number) {
    this.tabs.splice(index, 1);
}

}
