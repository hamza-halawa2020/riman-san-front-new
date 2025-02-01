import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private apiUrl = environment.backEndUrl;
    private data = '/login';
    constructor(private http: HttpClient) {}
    login(data: any) {
        return this.http.post(`${this.apiUrl}${this.data}`, data);
    }
}
