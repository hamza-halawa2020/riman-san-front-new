import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private apiUrl = environment.backEndUrl;
    private data = '/carts';

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    index() {
        const token = this.cookieService.get('token');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this.http.get(`${this.apiUrl}${this.data}`, { headers });
    }
}
