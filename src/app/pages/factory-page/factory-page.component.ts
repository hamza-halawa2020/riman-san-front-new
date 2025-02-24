import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { PageBannerComponent } from './page-banner/page-banner.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { FactoryService } from './factory.service';

@Component({
    selector: 'app-factory-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        NgClass,
        NgIf,
        NavbarComponent,
        PageBannerComponent,
        FooterComponent,
        BackToTopComponent,
        HttpClientModule,
    ],
    templateUrl: './factory-page.component.html',
    styleUrls: ['./factory-page.component.scss'],
    providers: [FactoryService],
})
export class FactoryPageComponent implements OnInit {
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private factoryService: FactoryService) {}

    ngOnInit(): void {}
}
