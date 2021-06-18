import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private timeTaken = null;
  private findRequestBody = null;
  constructor() { 
  }
  setTimeTaken(time) {      
    this.timeTaken = time;
    localStorage.setItem('resultTimeTaken',time);
  }  
  
  getTimeTaken() {  
    return this.timeTaken ? this.timeTaken : localStorage.getItem('resultTimeTaken');  
  }

  setRequestBody(reqBody) {
    this.findRequestBody = reqBody;
    localStorage.setItem('findReqBody',JSON.stringify(reqBody));
  }

  getRequestBody() {
    return this.findRequestBody ? this.findRequestBody : localStorage.getItem('findReqBody');
  }
}
