import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginService } from '../../pages/login-page/login.service';
import { CartService } from '../../pages/cart-page/cart.service';
import { Subscription } from 'rxjs';
import { FavouriteService } from '../../pages/favourite-page/favourite.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientCartService } from '../../pages/client-cart/client-cart.service';
import { FavouriteClientService } from '../../pages/favourite-client-page/favourite-client.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgIf,
        NgClass,
        NgbCollapseModule,
        TranslateModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    cartData: any[] = [];
    cartClientData: any[] = [];
    favClientData: any[] = [];
    favData: any[] = [];
    EMAIL:string ='info@rimansan.net';
    public cartSubscription!: Subscription;
    public cartClientSubscription!: Subscription;
    public favSubscription!: Subscription;
    public favClientSubscription!: Subscription;

    isLoggedIn: boolean = false;
    data: any;
    favouriteData: any;

    constructor(
        public router: Router,
        public loginService: LoginService,
        private cartService: CartService,
        private cartClientService: ClientCartService,
        private favouriteService: FavouriteService,
        private favouriteClientService: FavouriteClientService,
        private translate: TranslateService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();

        // Initialize languages
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en');

        // Load saved language from localStorage or use browser language
        const savedLang = localStorage.getItem('language');
        const browserLang = this.translate.getBrowserLang();
        const initialLang =
            savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'en');
        this.translate.use(initialLang);
        this.applyLanguageDirection(initialLang);
    }

    ngOnInit(): void {
        this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
            this.cartData = cart;
        });

        this.cartClientSubscription = this.cartClientService.cart$.subscribe(
            (cart) => {
                this.cartClientData = cart;
            }
        );

        this.favSubscription = this.favouriteService.fav$.subscribe((fav) => {
            this.favData = fav;
        });

        this.favClientSubscription = this.favouriteClientService.fav$.subscribe(
            (favClient) => {
                this.favClientData = favClient;
            }
        );

        this.router.events.subscribe(() => {
            this.cartService.refreshCart();
            this.cartClientService.refreshCart();
        });
        this.router.events.subscribe(() => {
            this.favouriteService.refreshFav();
            this.favouriteClientService.refreshFav();
        });
    }

    ngOnDestroy() {
        if (this.cartSubscription) this.cartSubscription.unsubscribe();
        if (this.cartClientSubscription)
            this.cartClientSubscription.unsubscribe();
        if (this.favSubscription) this.favSubscription.unsubscribe();
        if (this.favClientSubscription)
            this.favClientSubscription.unsubscribe();
    }

    isSticky: boolean = false;
    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    logout() {
        this.loginService.logout();
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
        this.applyLanguageDirection(lang);
        localStorage.setItem('language', lang); // Save to localStorage
    }

    getCurrentLanguage(): string {
        return this.translate.currentLang || this.translate.getDefaultLang();
    }

    // Helper method to apply language direction
    private applyLanguageDirection(lang: string) {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }
}
