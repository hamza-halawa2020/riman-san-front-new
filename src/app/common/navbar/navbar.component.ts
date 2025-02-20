import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginService } from '../../pages/login-page/login.service';
import { CartService } from '../../pages/cart-page/cart.service';
import { Subscription } from 'rxjs';
import { FavouriteService } from '../../pages/favourite-page/favourite.service';
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, NgIf, NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
    ngOnInit(): void {
        this.fetchCartData();
        this.fetchFavData();
        this.cartSub = this.cartService
            .getCartUpdateListener()
            .subscribe(() => {
                this.fetchCartData();
            });
        this.favSub = this.favouriteService
            .getUpdateListener()
            .subscribe(() => {
                this.fetchFavData();
            });
    }
    ngOnDestroy() {
        if (this.cartSub) {
            this.cartSub.unsubscribe();
        }
        if (this.favSub) {
            this.favSub.unsubscribe();
        }
    }

    isLoggedIn: boolean = false;
    data: any;
    favouriteData: any;
    private cartSub!: Subscription;
    private favSub!: Subscription;
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

    fetchCartData() {
        this.cartService.index().subscribe({
            next: (response) => {
                this.data = Object.values(response)[0];
            },
        });
    }
    fetchFavData() {
        this.favouriteService.index().subscribe({
            next: (response) => {
                this.favouriteData = Object.values(response)[0];
            },
        });
    }

    logout() {
        this.loginService.logout();
    }
}
