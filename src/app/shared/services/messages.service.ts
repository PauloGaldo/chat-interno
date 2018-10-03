import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface MessagesOp extends Function {
    (messages: Any[]): Any[];
}

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    message: any;
    // nuevo mensaje a enviar
    newMessages: Subject<message> = new Subject<message>();
    // array de mensajes activos
    messages: Observable<any[]>;

    constructor() {
        // marcar mensaje como leido

        this.markThreadAsRead.map((thread: Thread) => {
            return (messages: Message[]) => {
                return messages.map((message: Message) => {

                    if (message.thread.id === thread.id) {
                        message.isRead = true;
                    }
                    return message;
                });
            };
        })
            .subscribe(this.updates);
    }


    // Agregar mensaje
    addMessage(message: any): void {
        this.newMessages.next(message);
    }

    // vincular un usuario con un grupo de mensajes
    messagesForUser(thread: any, user: any): Observable<any> {
        return this.newMessages
            .filter((message: any) => {
                // belongs to this thread
                return (message.thread.id === thread.id) &&
                    // and isn't authored by this user
                    (message.author.id !== user.id);
            });
    }


}


