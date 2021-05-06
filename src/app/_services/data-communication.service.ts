import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Employee } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class DataCommunicationService {

  private loggedUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  public getLoggedUser(): Observable<any> {
    return this.loggedUser.asObservable();
  }

  public setLoggedUser(admin: Boolean, user: Employee | undefined) {
    // because Behaviour Subject at 'next' can only take 1 parameter, 'data' object is created to group admin and user
    let data = {
      admin: admin,
      user: user
    }
    return this.loggedUser.next(data);
  }


}
