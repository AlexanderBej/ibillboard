import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

// const httpOptions = {
//   responseType: 'text'
//   // headers: new HttpHeaders({
//   //   'Content-Type': 'application/json',
//   //   'Accept': 'text/html',
//   //   'Access-Control-Allow-Headers': 'Content-Type',
//   // }),
//   // withCredentials: true
// } as const

@Injectable({
  providedIn: 'root'
})
export class IbillboardService {

  private positionsUrl = environment.baseURL + environment.getWorkPositions;

  constructor(private http: HttpClient) { }

  getWorkPositions() {
    return this.http.get<any>(this.positionsUrl)
  }
  
}
