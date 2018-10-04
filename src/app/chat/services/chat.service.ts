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

}
