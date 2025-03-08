import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { OrderService } from './order.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
// import { DateLocalizationService } from '../date-localization.service'; // Assuming this exists

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, TranslateModule], // Added TranslateModule
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrderComponent implements OnInit {
    image = environment.imgUrl + 'products/';
    orders: any[] = [];
    expandedOrderId: number | null = null;
    isLoading: boolean = true;

    constructor(
        private orderService: OrderService,
        public translateService: TranslateService, // Added for translations
        // private dateLocalizationService: DateLocalizationService // Added for localized dates
    ) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.isLoading = true;
        this.orderService.index().subscribe({
            next: (response: any) => {
                this.orders = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching orders:', err);
                this.orders = [];
                this.isLoading = false;
            },
        });
    }

    toggleOrderDetails(orderId: number) {
        this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
    }

    getLocalizedDate(dateString: string) {
        // return this.dateLocalizationService.getRelativeTime(dateString);
    }
}