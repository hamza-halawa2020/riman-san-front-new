import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FavouriteService {
    private apiUrl = environment.backEndUrl;
    private data = '/favourites';
    private updated = new BehaviorSubject<void>(undefined);

    constructor(private http: HttpClient) {}
    index() {
        return this.http.get(`${this.apiUrl}${this.data}`);
    }
    notifyUpdate() {
        this.updated.next();
    }

    getUpdateListener() {
        return this.updated.asObservable();
    }
    add(id: any) {
        return this.http.post(`${this.apiUrl}${this.data}`, id);
    }

    delete(id: any) {
        return this.http.delete(`${this.apiUrl}${this.data}/${id}`);
    }
    clearCart() {
        return this.http.delete(`${this.apiUrl}/fav_clear`);
    }
}
