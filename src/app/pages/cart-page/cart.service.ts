import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class CartService {
    private apiUrl = environment.backEndUrl;
    private data = '/carts';
    private cartUpdated = new BehaviorSubject<void>(undefined);

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    private getHeaders() {
        const token = this.cookieService.get('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }
    notifyCartUpdate() {
        this.cartUpdated.next();
    }

    addToCart(id: any) {
        return this.http.post(`${this.apiUrl}${this.data}`, id);
    }

    updateQuantity(item: any) {
        return this.http.put(`${this.apiUrl}${this.data}/${item.id}`, item, {
            headers: this.getHeaders(),
        });
    }

    getCartUpdateListener() {
        return this.cartUpdated.asObservable();
    }

    index() {
        return this.http.get(`${this.apiUrl}${this.data}`, {
            headers: this.getHeaders(),
        });
    }
    allCountries() {
        return this.http.get(`${this.apiUrl}/countries`);
    }
    allShipments() {
        return this.http.get(`${this.apiUrl}/shipments`);
    }
    allCities() {
        return this.http.get(`${this.apiUrl}/cities`);
    }

    delete(id: any) {
        return this.http.delete(`${this.apiUrl}${this.data}/${id}`, {
            headers: this.getHeaders(),
        });
    }

    showCoupon(payload: { code: string }) {
        return this.http.post(`${this.apiUrl}/showCoupon`, payload);
    }
}
