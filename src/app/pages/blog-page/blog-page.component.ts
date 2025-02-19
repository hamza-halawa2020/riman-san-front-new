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
export class BlogPageComponent {}
