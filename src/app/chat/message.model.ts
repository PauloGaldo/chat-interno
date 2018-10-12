import { Contact } from "./contact.model";

export interface Message {
    id: string;
    emisor: Contact;
    text: string;
    fileUrl: string;
    fileName: string;
    level: String;
    status: String;
    read: boolean;
    timestamp: Date;
}
