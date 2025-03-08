import { RouterLink, Router } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { PostService } from './post.service';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale'; // Import Arabic locale
import { enUS } from 'date-fns/locale'; // Import English locale
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule,
    ],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss',
    providers: [PostService],
})
export class BlogComponent implements OnInit {
    data: any[] = []; // Explicitly typed as an array
    image = environment.imgUrl + 'posts/';
    successMessage: string = '';
    errorMessage: string = '';

    constructor(
        public router: Router,
        private postService: PostService,
        public translateService: TranslateService // Injected TranslateService
    ) {}

    ngOnInit(): void {
        this.fetchData();
        this.translateService.onLangChange.subscribe(() => {
            this.translateData();
        });
    }

    getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const locale = this.translateService.currentLang === 'ar' ? ar : enUS;
        return formatDistanceToNow(date, { addSuffix: true, locale }); // e.g., "2 days ago" or "منذ يومين"
    }

    fetchData() {
        this.postService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0] as any[];
                this.translateData();
            },
            error: (error) => {
                this.errorMessage =
                    this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((post: any) => {
            post.translatedTitle =
                this.translateService.instant(post.title) || post.title;
            post.translatedAdmin =
                this.translateService.instant(post.admin) || post.admin;
            post.translatedRelativeTime = this.getRelativeTime(post.created_at); // Update relative time on language change
        });
    }
}
