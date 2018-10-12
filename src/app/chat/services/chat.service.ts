import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ChatService {

    constructor(private http: HttpClient) { }

    /**
     * obtener listado de contactos
     */
    getContactList(): Observable<any> {
        return this.http.get('assets/mocks/contacts.json');
    }

    /**
     * Funcion para obtener cola de mensajes
     */
    getMessagesList(): Observable<any> {
        return this.http.get('assets/mocks/chat-entry.json');
    }

    /**
     * Funcion para subir archivos a servidor para su posterior descarga
     * @param file archivo a subir
     */
    uploadFile(file: File): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post('file/uploadFile', data);
    }

    /**
     * Funcion para filtrar cola de mensajes
     */
    filterMessageList(text: string): Observable<any> {
        return of(null);
    }

    /**
     * Funcion para filtrar listado de contactos
     * @param text texto de busqueda
     */
    filterContactList(text: string): Observable<any> {
        return of(null);
    }

}
