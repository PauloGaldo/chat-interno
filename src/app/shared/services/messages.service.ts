import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

type MessagesOp = (messages: any[]) => any[];

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    message: any;
    // nuevo mensaje a enviar
    newMessages: Subject<any> = new Subject<any>();
    // array de mensajes activos
    messages: Observable<any[]>;
    markThreadAsRead: string[] = ['1'];
    updates: any;

    constructor() {
        // marcar mensaje como leido

        this.markThreadAsRead.map((thread: any) => {
            return (messages: any[]) => {
                return messages.map((message: any) => {

                    if (message.thread.id === thread.id) {
                        message.isRead = true;
                    }
                    return message;
                });
            };
        });
        //    .subscribe(this.updates);
    }


    // Agregar mensaje
    addMessage(message: any): void {
        this.newMessages.next(message);
    }

    // vincular un usuario con un grupo de mensajes
    messagesForUser(thread: any, user: any): Observable<any> {
        return this.newMessages.asObservable();
            /*.filter((message: any) => {
                // belongs to this thread
                return (message.thread.id === thread.id) &&
                    // and isn't authored by this user
                    (message.author.id !== user.id);
            });*/
    }


}


