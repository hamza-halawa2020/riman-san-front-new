import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PostService } from './post.service';
import { CommonModule } from '@angular/common';
import { BlogComponent } from '../../common/blog/blog.component';
import { formatDistanceToNow } from 'date-fns';
import { environment } from '../../../environments/environment.development';

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
        BlogComponent,
    ],
    templateUrl: './blog-page.component.html',
    styleUrl: './blog-page.component.scss',
    providers: [PostService],
})
export class BlogPageComponent {
    data: any;
    image = environment.imgUrl + 'posts/';

    constructor(public router: Router, private postService: PostService) {}

    ngOnInit(): void {
        this.fetchData();
    }

    getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        return formatDistanceToNow(date, { addSuffix: true }); // e.g., "2 days ago"
    }

    fetchData() {
        this.postService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
            error: (error) => {},
        });
    }
}
