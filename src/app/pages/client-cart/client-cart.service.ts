import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class ClientCartService {
    private apiUrl = environment.backEndUrl;
    private data = '/carts';
    constructor(private http: HttpClient) {}
    index() {
        return this.http.get(`${this.apiUrl}${this.data}`);
    }
}
