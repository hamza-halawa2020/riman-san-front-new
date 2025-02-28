import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { OrderService } from './order.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
})
export class OrderComponent implements OnInit {
    image = environment.imgUrl + 'products/'; // Adjust path as needed
    orders: any[] = []; // Array to hold orders, initialized as empty
    expandedOrderId: number | null = null; // Track which order is expanded
    isLoading: boolean = true; // Add loading state

    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.fetchdata();
    }

    fetchdata() {
        this.isLoading = true; // Set loading to true when fetching starts
        this.orderService.index().subscribe({
            next: (response: any) => {
                this.orders = response.data || []; // Use empty array as fallback if response.data is undefined
                this.isLoading = false; // Set loading to false when data is received
            },
            error: (err) => {
                console.error('Error fetching orders:', err);
                this.orders = []; // Ensure orders is an empty array on error
                this.isLoading = false; // Stop loading on error
            },
        });
    }

    toggleOrderDetails(orderId: number) {
        this.expandedOrderId =
            this.expandedOrderId === orderId ? null : orderId;
    }
}
