import { RouterLink, Router } from '@angular/router';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { PostService } from './post.service';
import { formatDistanceToNow } from 'date-fns';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-blog',
    standalone: true,
    imports: [
        RouterLink,
        RouterLink,
        CommonModule,
        NgIf,
        NgClass,
        HttpClientModule,
        TranslateModule
    ],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss',
    providers: [PostService],
})
export class BlogComponent implements OnInit {
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
            error: (error) => {
            },
        });
    }
}
