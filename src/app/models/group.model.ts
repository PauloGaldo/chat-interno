import { User } from './user.model';

export class Group {
    public idGroup: string;
    public users: User[];
    public messages: [];
    public files: [];
    constructor(idGroup: string, users: User[], messages: [], files: []) {
        this.idGroup = idGroup;
        this.users = users;
        this.messages = messages;
        this.files = files;
    }
}
