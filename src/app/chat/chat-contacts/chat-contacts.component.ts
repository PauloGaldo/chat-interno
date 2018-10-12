import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { Contact } from '../contact.model';

@Component({
    selector: 'ci-chat-contacts',
    templateUrl: './chat-contacts.component.html',
    styleUrls: ['./chat-contacts.component.scss']
})
export class ChatContactsComponent implements OnInit {

    @Output() changed: any = new EventEmitter<any>();
    public contacts = [];
    public chats = [];
    public contactsGroup = [];
    public activeContact: Contact;
    public optionGroup = false;
    public optionGroupShow = false;
    public searchMessagesForm: FormGroup;
    public searchContactsForm: FormGroup;


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private chatService: ChatService,
        private formbuilder: FormBuilder
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

        // CARGAR MOCK DE CHATS
        this.chatService.getMessagesList().subscribe(response => {
            // this.chats = response.data;
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
     * Metodo para seleccionar y poner activo un contacto del listado
     * @param contact contacto del listado
     */
    selectContact(contact: Contact): void {
        if (contact) {
            this.activeContact = contact;
            const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
            queryParams['id'] = contact.id;
            this.router.navigate(['.'], { queryParams: queryParams });
            this.changed.emit(contact);
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
            console.log(form);
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
        console.log(result);
        return result ? true : false;
    }

    cancelGroup() {
        this.contactsGroup = [];
        this.optionGroupShow = true;
    }



}
