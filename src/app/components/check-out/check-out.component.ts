import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { Shipping } from 'src/app/models/shipping.model';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { OrderService } from 'src/app/services/order.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
    selector: 'app-check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {

    _cartItems: ShoppingCartItem[] = [];
    shipping = new Shipping();
    constructor(private _cartService: ShoppingCartService, private router: Router, private _orderService: OrderService, private toastr: ToastrService) { }

    ngOnInit() {
        this._cartItems = this._cartService.CartItems;
    }
    get totalPrice() {
        return this._cartService.CartItemsTotal;
    }
    get totalItemsCount() {
        return this._cartService.CartItemsCount;
    }
    placeOrder() {
        let order = new Order();
        order.datePlaced = new Date().getTime();
        order.amount = this._cartService.CartItemsTotal;
        order.userId = localStorage.getItem('loggedInUserId')!;
        order.items = this._cartItems;
        order.shippingDetails = {
            name: this.shipping.name,
            addressLine1: this.shipping.addressLine1,
            addressLine2: this.shipping.addressLine2,
            city: this.shipping.city
        };

        this._orderService.create(order)
            .then((response) => {
                console.log(response)
                this._cartService.clearCartItems();
                this.toastr.success('Order placed successfully...!');
                this.router.navigate(['/order-success', response.id]);
            })
            .catch((error: any) => {
                this.toastr.error('Un-handled exception occured...!');
            });
    }
}

