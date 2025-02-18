import { Component, OnInit } from '@angular/core';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { ProfileService } from './profile.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        CommonModule,
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
    image = environment.imgUrl + 'users/';
    data: any;
    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.profileService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
        });
    }
}
