import { Contact } from "./contact.model";

export interface Message {
    id: string;
    emisor: Contact;
    text: string;
    fileUrl: string;
    level: String;
    status: String;
    read: boolean;
    timestamp: Date;
}
