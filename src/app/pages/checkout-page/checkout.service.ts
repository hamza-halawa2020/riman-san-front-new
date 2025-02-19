import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class CheckoutService {
    private apiUrl = environment.backEndUrl;
    constructor(private http: HttpClient) {}
    allProducts() {
        return this.http.get(`${this.apiUrl}/products`);
    }
}
