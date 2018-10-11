export class User {
    public idUsuario: string;
    public idUsuarioUPD: string;
    public perfil: string;
    public subcentro: any;

    constructor(idUsuario: string, idUsuarioUPD: string, perfil: string, subcentro: any) {
        this.idUsuario = idUsuario;
        this.idUsuarioUPD = idUsuarioUPD;
        this.perfil = perfil;
        this.subcentro = subcentro;
    }
}
