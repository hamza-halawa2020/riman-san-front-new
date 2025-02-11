import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class PostsService {
    private apiUrl = environment.backEndUrl;
    private data = '/posts';
    constructor(private http: HttpClient) {}
    show(id: number) {
        return this.http.get(`${this.apiUrl}${this.data}/${id}`);
    }
    allSocial() {
        return this.http.get(`${this.apiUrl}/social-links`);
    }
    allSideBarBanners() {
        return this.http.get(`${this.apiUrl}/side-bar-banners`);
    }
    randomPosts() {
        return this.http.get(`${this.apiUrl}/random-posts`);
    }
}
