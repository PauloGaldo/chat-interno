import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {

    constructor(private http: HttpClient) { }

    /**
     * obtener listado de contactos
     */
    getContactList(): Observable<any> {
        return this.http.get('assets/mocks/contacts.json');
    }

    getMessagesList(): Observable<any> {
        return this.http.get('assets/mocks/chat-entry.json');
    }

    uploadFile(file: File): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post('file/uploadFile', data);
    }

}
