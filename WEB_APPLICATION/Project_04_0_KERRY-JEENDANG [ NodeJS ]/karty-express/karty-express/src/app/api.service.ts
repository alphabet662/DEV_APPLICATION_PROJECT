import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url='http://45.76.188.140/';
  constructor(private http: HttpClient) { }
  getShipmentWithID(track_id:string){
    return this.http.get(this.url + 'shipment/'+ track_id);
  }
}
