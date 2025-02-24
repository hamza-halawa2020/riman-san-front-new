import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class FavouriteClientService {
    private apiUrl = environment.backEndUrl;
    private data = '/favourites';
    private favSubject = new BehaviorSubject<any[]>([]);
    fav$ = this.favSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadInitialFavData();
    }

    private loadInitialFavData() {
        const fav = localStorage.getItem('fav');
        if (fav) {
            this.favSubject.next(JSON.parse(fav));
        } else {
            this.index().subscribe({
                next: (response: any) => {
                    this.favSubject.next(response.data);
                    localStorage.setItem('fav', JSON.stringify(response.data));
                },
                error: (error) => {
                    console.error('Failed to load fav data:', error);
                },
            });
        }
    }

    index() {
        return this.http.get(`${this.apiUrl}${this.data}`);
    }

    add(id: any) {
        return this.http.post(`${this.apiUrl}${this.data}`, id).pipe(
            tap((response: any) => {
                const currentFav = this.favSubject.value;
                const updatedFav = [...currentFav, response.data];
                this.favSubject.next(updatedFav);
                localStorage.setItem('fav', JSON.stringify(updatedFav));
            })
        );
    }

    delete(id: any) {
        return this.http.delete(`${this.apiUrl}${this.data}/${id}`).pipe(
            tap(() => {
                const currentFav = this.favSubject.value;
                const updatedFav = currentFav.filter((item) => item.id !== id);
                this.favSubject.next(updatedFav);
                localStorage.setItem('fav', JSON.stringify(updatedFav));
                this.refreshFav();
            })
        );
    }
    clearFav() {
        return this.http.delete(`${this.apiUrl}/fav_clear`).pipe(
            tap(() => {
                this.favSubject.next([]);
                localStorage.setItem('fav', JSON.stringify([]));
                this.refreshFav();
            })
        );
    }
    refreshFav() {
        const fav = localStorage.getItem('fav');
        if (fav) {
            this.favSubject.next(JSON.parse(fav));
        }
    }
}
