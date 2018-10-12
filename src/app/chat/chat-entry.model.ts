import { Contact } from "./contact.model";
import { Message } from "./message.model";

export interface ChatEntry {
    id: string;
    name: string;
    lastMessage: Message;
    unreadMessages: number;
    receptors: Contact[];
    listName: string;
}
