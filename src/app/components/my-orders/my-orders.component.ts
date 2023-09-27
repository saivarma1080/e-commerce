import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
    selector: 'app-admin-orders',
    templateUrl: './my-orders.component.html',
    styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

    pageNumber: number = 1;
  
    myOrders: Order[] = [];

    constructor(public service: OrderService) { }
    ngOnInit(): void {
        this.loadData();
    }
    loadData() {
        let userId = localStorage.getItem('loggedInUserId');

        this.service.getUserOrders(userId!)
            .subscribe(response => {
                this.myOrders = response.map((data) => {
                    return {
                        id: data.payload.doc.id,
                        ...data.payload.doc.data() as Order
                    }
                });

            })
    }
}
