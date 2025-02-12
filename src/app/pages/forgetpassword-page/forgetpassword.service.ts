import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root',
})
export class ForgetpasswordService {
    private apiUrl = environment.backEndUrl;
    private data = '/login';
    constructor(private http: HttpClient) {}
    login(data: any) {
        return this.http.post(`${this.apiUrl}${this.data}`, data, {
            withCredentials: true,
        });
    }
}
