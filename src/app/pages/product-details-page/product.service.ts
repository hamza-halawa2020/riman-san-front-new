import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = environment.backEndUrl;
    private data = '/products';
    constructor(private http: HttpClient) {}
    show(id: number) {
        return this.http.get(`${this.apiUrl}${this.data}/${id}`);
    }

    allSocial() {
        return this.http.get(`${this.apiUrl}/social-links`);
    }
}
