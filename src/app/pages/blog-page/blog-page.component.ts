import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PostService } from './post.service';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { environment } from '../../../environments/environment.development';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ar } from 'date-fns/locale'; // Import Arabic locale
import { enUS } from 'date-fns/locale'; // Import English locale

@Component({
    selector: 'app-blog-page',
    standalone: true,
    imports: [
        HttpClientModule,
        CommonModule,
        RouterLink,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        TranslateModule,
    ],
    templateUrl: './blog-page.component.html',
    styleUrl: './blog-page.component.scss',
    providers: [PostService],
})
export class BlogPageComponent implements OnInit {
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
                this.errorMessage = this.translateService.instant('UNEXPECTED_ERROR');
                setTimeout(() => {
                    this.errorMessage = '';
                }, 3000);
            },
        });
    }

    translateData() {
        if (!this.data || !Array.isArray(this.data)) return;

        this.data.forEach((post: any) => {
            post.translatedTitle = this.translateService.instant(post.title) || post.title;
            post.translatedAdmin = this.translateService.instant(post.admin) || post.admin;
            post.translatedRelativeTime = this.getRelativeTime(post.created_at); // Update relative time on language change
        });
    }
}