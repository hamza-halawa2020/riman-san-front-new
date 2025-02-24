import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { FavouritePageComponent } from '../favourite-page/favourite-page.component';
import { FavouriteClientPageComponent } from '../favourite-client-page/favourite-client-page.component';

@Component({
    selector: 'app-favourite-page-wrapper',
    standalone: true,
    imports: [
        CommonModule,
        FavouritePageComponent,
        FavouriteClientPageComponent,
    ],
    templateUrl: './favourite-page-wrapper.component.html',
})
export class FavouritePageWrapperComponent {
    userType: string;

    constructor(private route: ActivatedRoute) {
        this.userType = this.route.snapshot.data['userType'];
    }
}
