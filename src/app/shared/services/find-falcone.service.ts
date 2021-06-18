import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FindFalconeService {

  constructor(
    private http: HttpClient
  ) { }

  getAllHideOuts(): Observable<any>{
    return this.http.get('https://findfalcone.herokuapp.com/planets');
  }

  getAllVehicles(): Observable<any>{
    return this.http.get('https://findfalcone.herokuapp.com/vehicles');
  }

  getToken(): any{
    const httpHeaders = new HttpHeaders({ Accept: 'application/json' });
    const options = { headers: httpHeaders };
    const token =  this.http.post('https://findfalcone.herokuapp.com/token', {}, options).toPromise();
    return token;
  }

  findFalcone(data: any): Observable<any>{
    const httpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-type': 'application/json'
    });
    const options = { headers: httpHeaders };
    return this.http.post('https://findfalcone.herokuapp.com/find', data, options);
  }
}
