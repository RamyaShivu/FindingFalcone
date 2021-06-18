import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FindFalconeService {
  reqBody = null;
  timeTaken = null;
  constructor(
    private http: HttpClient
  ) { }
  /* API call to get a list of Hideouts */
  getAllHideOuts(): Observable<any>{
    return this.http.get('https://findfalcone.herokuapp.com/planets');
  }
  /* API call to get the list of vehicles available */
  getAllVehicles(): Observable<any>{
    return this.http.get('https://findfalcone.herokuapp.com/vehicles');
  }
  /* API call to get the token */
  getToken(): any{
    const httpHeaders = new HttpHeaders({ Accept: 'application/json' });
    const options = { headers: httpHeaders };
    const token =  this.http.post('https://findfalcone.herokuapp.com/token', {}, options).toPromise();
    return token;
  }
  /* API call to get find falcone */
  findFalcone(data: any): Observable<any>{
    const httpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-type': 'application/json'
    });
    const options = { headers: httpHeaders };
    return this.http.post('https://findfalcone.herokuapp.com/find', data, options);
  }
}
