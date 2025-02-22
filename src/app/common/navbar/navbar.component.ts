import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginService } from '../../pages/login-page/login.service';
import { CartService } from '../../pages/cart-page/cart.service';
import { Subscription } from 'rxjs';
import { FavouriteService } from '../../pages/favourite-page/favourite.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf, NgClass, NgbCollapseModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    cartData: any[] = [];
    favData: any[] = [];

    public cartSubscription!: Subscription;
    public favSubscription!: Subscription;

    ngOnInit(): void {
        this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
            this.cartData = cart;
        });
        this.favSubscription = this.favouriteService.fav$.subscribe((fav) => {
            this.favData = fav;
        });

        this.router.events.subscribe(() => {
            this.cartService.refreshCart();
        });
        this.router.events.subscribe(() => {
            this.favouriteService.refreshFav();
        });
    }
    ngOnDestroy() {
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }
    }

    isLoggedIn: boolean = false;
    data: any;
    favouriteData: any;
    constructor(
        public router: Router,
        public loginService: LoginService,
        private cartService: CartService,
        private favouriteService: FavouriteService
    ) {
        this.isLoggedIn = !!loginService.isLoggedIn();
    }

    // Navbar Sticky
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
}
