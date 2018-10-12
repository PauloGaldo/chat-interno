import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeepStreamService } from '../../shared/services/deep-stream.service';
import { ChatEntry } from '../chat-entry.model';
import { Contact } from '../contact.model';
import { ChatService } from '../services/chat.service';

@Component({
    selector: 'ci-chat-contacts',
    templateUrl: './chat-contacts.component.html',
    styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {

    @Output() changed: any = new EventEmitter<any>();
    public contacts: Contact[] = [];
    public chats: ChatEntry[] = [];
    public contactsGroup = [];
    public activeContact: Contact;
    public activeChat: ChatEntry;
    public optionGroup = false;
    public optionGroupShow = false;
    public searchMessagesForm: FormGroup;
    public searchContactsForm: FormGroup;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private chatService: ChatService,
        private formbuilder: FormBuilder,
        private deepStreamService: DeepStreamService
    ) {
        this.searchMessagesForm = this.formbuilder.group({
            filter: ''
        });
        this.searchContactsForm = this.formbuilder.group({
            filter: ''
        });

        // CARGAR MOCK DE CONTACTOS
        this.chatService.getContactList().subscribe(response => {
            this.contacts = response.data;
        });
        // CARGAR MOCK DE MENSAJES
        this.chatService.getMessagesList().subscribe(response => {
            // this.chats = response.data;
        });
        this.deepStreamService.chatEntriesAnnounced.subscribe(response => {
            this.chats = response;
        });
    }

    ngOnInit() {
    }

    /**
     * Funcion para determinar que contacto esta activo del listado
     * @param contact contacto del listado
     */
    isContactActive(contact: Contact): boolean {
        const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
        if (contact.id === queryParams['id']) {
            this.activeContact = contact;
            return true;
        }
        return false;
    }

    /**
     * Metodo para seleccionar y poner activo un chat del listado
     * @param chat chat del listado
     */
    selectChat(chat: ChatEntry, contact?: Contact): void {
        if (chat) {
            this.activeChat = chat;
            const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
            queryParams['id'] = chat.id;
            this.router.navigate(['.'], { queryParams: queryParams });
            this.changed.emit(chat);
        } else if (contact) {
            const newChat: ChatEntry = {
                id: `${this.deepStreamService.user.id}-${contact.id}`,
                lastMessage: null,
                listName: null,
                name: `${contact.name} ${contact.address}`,
                receptors: [contact],
                unreadMessages: null
            };
            const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
            queryParams['id'] = newChat.id;
            this.router.navigate(['.'], { queryParams: queryParams });
            this.changed.emit(newChat);
            // CREACION DE NUEVA ENTRADA DE CHAT
            const recordName = `${this.deepStreamService.user.id}-${contact.id}`
            const record = this.deepStreamService.session.record.getRecord(recordName);
            record.whenReady(message => {
                message.set(newChat);
                this.deepStreamService.entries.addEntry(recordName);
            });
        }
    }

    // Crear grupo
    createGroup() {
        this.contactsGroup = [];
        this.optionGroup = true;
    }

    // Agregar contacto al grupo
    addContactGroup(contact: Contact) {
        this.contactsGroup.push(contact);
    }

    /**
     * Eliminar de seleccion de grupos a un contacto en particular usando
     * su indice
     * @param index indice de contacto
     */
    deleteContactGroup(index: any) {
        this.contactsGroup.splice(index, 1);
    }

    /**
     * Funcion para filtrar mensajes de chat
     * @param form formulario de busqueda
     */
    filterMessagesOnChat(form: FormGroup) {
        if (form.valid) {
            this.chatService.filterMessageList(form.controls.filter.value).subscribe(response => {
                console.log(response);
            });
        }
    }

    /**
     * Funcion para determinar si el contacto se encuentra en el listado de contactos para grupo seleccionado
     * @param contact contacto del listado
     */
    isContactGroupSelected(contact: Contact): boolean {
        const result = this.contactsGroup.filter(item => {
            return item.id === contact.id;
        })[0];
        return result ? true : false;
    }

    cancelGroup() {
        this.contactsGroup = [];
        this.optionGroupShow = true;
    }

}
