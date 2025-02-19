import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class CoursesService {
    private apiUrl = environment.backEndUrl;
    private data = '/courses';
    constructor(private http: HttpClient) {}
    show(id: number) {
        return this.http.get(`${this.apiUrl}${this.data}/${id}`);
    }

    allSocial() {
        return this.http.get(`${this.apiUrl}/social-links`);
    }
    addReview(item: any) {
        return this.http.post(`${this.apiUrl}/course-reviews`, item);
    }
}
