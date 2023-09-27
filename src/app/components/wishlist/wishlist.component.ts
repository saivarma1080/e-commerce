import { Component, OnInit } from "@angular/core";
import { ShoppingCartItem } from "src/app/models/shopping-cart-item";
import { Wishlist } from "src/app/models/wishlist.model";
import { AuthService } from "src/app/services/auth.service";
import { ShoppingCartService } from "src/app/services/shopping-cart.service";

import { WishlistService } from "src/app/services/wishlist.service";

@Component({
    selector: 'wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.css']
})

export class WishlistComponent implements OnInit {
    wishlist: Wishlist[] = [];
    constructor(private _wishlistService: WishlistService, private _cartService: ShoppingCartService, private authService: AuthService) {
    }
    ngOnInit(): void {
        this.loadWishlist();
    }
    loadWishlist() {
        this._wishlistService.read(this.authService.loggedInUserId!)
            .subscribe(response => {
                this.wishlist = response.map((data) => {
                    return {
                        id: data.payload.doc.id,
                        ...data.payload.doc.data() as Wishlist
                    }
                });
            })
    }
    addToCart(wishlist: Wishlist) {
        let cartItem = new ShoppingCartItem();
        cartItem.id = wishlist.productId;
        cartItem.title = wishlist.title;
        cartItem.price = wishlist.price;
        cartItem.category = wishlist.category;
        cartItem.imageUrl = wishlist.imageUrl;
        cartItem.quantity = 1;
        cartItem.totalPrice = cartItem.quantity * cartItem.price;
        this._cartService.addItemToCart(cartItem);
        this._wishlistService.delete(wishlist.id!);
    }
    removeFromWishlist(id: any) {
        this._wishlistService.delete(id!);
    }
}