import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // variable almacena el usuario actual
  currentUser: any;

  constructor() { }

  // metodo para establecer el usuario actual
  setCurrentUser(newUser: any): void {
    this.currentUser.next(newUser);
  }

}
