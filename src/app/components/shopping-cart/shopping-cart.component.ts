import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Product } from "src/app/models/product.model";
import { ShoppingCartItem } from "src/app/models/shopping-cart-item";
import { ShoppingCartService } from "src/app/services/shopping-cart.service";

@Component({
    selector: 'shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent implements OnInit {

    _cartItems: ShoppingCartItem[] = [];

    constructor(private _cartService: ShoppingCartService, private router: Router) { }

    ngOnInit() {
        this._cartItems = this._cartService.CartItems;
    }
    clearCart() {
        this._cartService.clearCartItems();
        this._cartItems = this._cartService.CartItems;
    }
    checkOut() {
        this.router.navigate(['/check-out'])
    }
    addToCart(_cartItem: ShoppingCartItem) {
        this._cartService.addItemToCart(_cartItem);
        this._cartItems = this._cartService.CartItems;
    }
    removeFromCart(_cartItem: ShoppingCartItem) {
        this._cartService.removeItemFromCart(_cartItem);
        this._cartItems = this._cartService.CartItems;
    }
    getQuantity(_product: Product) {
        let _itemQty: number = 0;
        this._cartService.CartItems.filter(item => item.id === _product.id).forEach(_item => { _itemQty += _item.quantity })
        return _itemQty;
    }
    get totalPrice() {
        return this._cartService.CartItemsTotal;
    }
    get totalItemsCount() {
        return this._cartService.CartItemsCount;
    }
}