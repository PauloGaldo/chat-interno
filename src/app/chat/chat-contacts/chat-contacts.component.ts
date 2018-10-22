import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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
    public selectedTab = 0;
    public contactsGroup: Array<Contact> = [];
    public activeContact: Contact;
    public activeChat: ChatEntry;
    public optionGroup = false;
    public searchMessagesForm: FormGroup;
    public searchContactsForm: FormGroup;
    public groupForm: FormGroup;
    public group: any[] = [];

    private chatEntriesSource: Subject<any> = new Subject<any>();
    public chatEntriesAnnounced = this.chatEntriesSource.asObservable();
    public chatEntries: ChatEntry[] = [];
    public entries: any;

    constructor(
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
        this.groupForm = this.formbuilder.group({
            groupName: ['', [Validators.required]]
        });

        // CARGAR MOCK DE CONTACTOS
        this.chatService.getContactList().subscribe(response => {
            this.contacts = response.data;
        });
    }

    ngOnInit() {
        if (this.deepStreamService.user) {
            this.loadUserChatEntries();
        }
    }

    /**
     * Funcion para determinar que contacto esta activo del listado
     * @param contact contacto del listado
     */
    isChatActive(chat: ChatEntry): boolean {
        if (!this.activeChat) {
            return false;
        }
        return this.activeChat === chat;
    }

    /**
     * Metodo para seleccionar y poner activo un chat del listado
     * @param chat chat del listado
     */
    selectChat(chat: ChatEntry, contact?: Contact): void {
        if (chat) {
            this.activeChat = chat;
            this.changed.emit(chat);
        } else if (contact) {
            if (!this.entries) {
                this.loadUserChatEntries();
            }
            const newChat: ChatEntry = {
                id: `${this.deepStreamService.user.id}_${contact.id}`,
                lastMessage: null,
                listName: `chat_entries/${this.deepStreamService.user.id}_${contact.id}`,
                name: `${this.deepStreamService.user.id} ${contact.id}`,
                receptors: [this.deepStreamService.user, contact],
                unreadMessages: null,
                timestamp: new Date()
            };
            // CREACION DE NUEVA ENTRADA DE CHAT
            const recordName = newChat.listName;
            const record = this.deepStreamService.session.record.getRecord(recordName);
            record.whenReady(message => {
                message.set(newChat);
                this.entries.addEntry(recordName);
            });
            this.selectedTab = 0;
            this.addChatEntryToContact(contact, recordName);
            this.changed.emit(newChat);
        }
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
     * Metodo para inicializar creacion de grupos
     */
    createGroup() {
        this.contactsGroup = [];
        this.optionGroup = true;
    }

    /**
     * Metodo para crear entrada en la cola de mensajes para los grupos
     */
    createGroupEntry(name: string, contacts: Contact[]) {
        this.group.push({
            groupName: name,
            contacts: contacts
        });
        const newGroupChat: ChatEntry = {
            id: `${this.deepStreamService.user.id}_${name}`,
            lastMessage: null,
            listName: `chat_entries/${this.deepStreamService.user.id}_${name}`,
            name: `${name}`,
            receptors: [this.deepStreamService.user, ...contacts],
            unreadMessages: null,
            timestamp: new Date()
        };
        // CREACION DE NUEVA ENTRADA DE CHAT PARA EL GRUPO
        const recordName = newGroupChat.listName;
        const record = this.deepStreamService.session.record.getRecord(recordName);
        record.whenReady(message => {
            message.set(newGroupChat);
            this.entries.addEntry(recordName);
        });
        this.selectedTab = 0;
        this.changed.emit(newGroupChat);
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
        if (this.contactsGroup.length === 0) {
            this.cancelGroup();
        }
    }

    /**
     * Funcion para determinar si el contacto se encuentra en el listado de contactos para grupo seleccionado
     * @param contact contacto del listado
     */
    isContactGroupSelected(contact: Contact): boolean {
        const result = this.contactsGroup.find(item => {
            return item.id === contact.id;
        });
        return result ? true : false;
    }

    /**
     * Metodo para cerrar creacion de grupos
     */
    cancelGroup() {
        this.contactsGroup = [];
        this.optionGroup = false;
        this.groupForm.reset();
    }

    /**
     * Metodo para validar la creacion de grupos
     * @param form formulario de nombre de grupo
     * @param contacts listado de contactos
     */
    addGroup(form: FormGroup, contacts: any[]) {
        if (form.valid) {
            this.createGroupEntry(form.controls.groupName.value, contacts);
            this.optionGroup = false;
            this.groupForm.reset();
            this.contactsGroup = [];
        }
    }

    /**
     * Metodo para cargar la lista de Chat-Entries para el usuario logueado
     */
    loadUserChatEntries(): void {
        // ENTRADAS DE CHAT
        this.entries = this.deepStreamService.session.record.getList(`${this.deepStreamService.user.username}-chat-entries`);
        this.entries.whenReady(list => {
            // OBTENEMOS MENSAJES
            const entries = list.getEntries();
            for (let i = 0; i < entries.length; i++) {
                this.deepStreamService.session.record.getRecord(entries[i]).whenReady(record => {
                    record.subscribe(data => {
                        this.chatEntries.unshift(data);
                        this.chatEntriesSource.next(this.chatEntries);
                    }, true);
                });
            }
            // Listen to new entries
            list.on('entry-added', (recordName) => {
                this.deepStreamService.session.record.getRecord(recordName).whenReady(record => {
                    record.subscribe(data => {
                        this.chatEntries.unshift(data);
                        this.selectChat(data);
                        this.chatEntriesSource.next(this.chatEntries);
                    }, true);
                });
            });
        });
    }

    /**
     * Funcion para agregar contacto a cola de mensajes o descargar el existente
     * 
     * @param contact contacto
     * @param recordName nombre de registro a guardar
     */
    addChatEntryToContact(contact: Contact, recordName: string): void {
        console.log('addChatEntryToContact:args ===>', contact, recordName);
        const userId = this.deepStreamService.user.id;
        console.log('                    userId ===>', userId);
        const contactChatEntries = this.deepStreamService.session.record
            .getList(`${contact.username}-chat-entries`);
        contactChatEntries.whenReady(list => {
            const entries = list.getEntries();
            let found = false;
            console.log('contactChatEntries ===>', contactChatEntries, entries);
            for (let i = 0; !found && i < entries.length; i++) {
                if (contactChatEntries.get(i) === contact ) {
                    found = true;
                    console.log(found);
                    found = found || entries[i] === `chat_entries/${contact.username}_${userId}`;
                    found = found || entries[i] === `chat_entries/${userId}_${contact.username}`;
                    console.log('ChatEntry', i, entries[i], found);
                }
            }
            if (!found) {
                contactChatEntries.addEntry(recordName);
            } else {
                contactChatEntries.discard();
            }
        });
    }

    verifyChat() {

    }
}
