import { Shipping } from "./shipping.model";
import { ShoppingCartItem } from "./shopping-cart-item";

export class Order {
    id?: string;
    userId: string;
    datePlaced: number;
    shippingDetails: Shipping = new Shipping();
    items: ShoppingCartItem[] = [];
    amount: number;
}