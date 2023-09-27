import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {

  saleProductData: any[] = [];
  saleUserData: any[] = [];
  public saleProductDataInput: any;
  public loader: boolean = false;
  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    let productOrderItems: any[] = [];
    let userItems: any[] = [];
    this.orderService.getUserOrders(this.authService.loggedInUserId!)
      .subscribe((response: any) => {
        let _lstOrders = response.map((data: any) => {
          return {
            id: data.payload.doc.id,
            ...data.payload.doc.data() as Order
          }
        });
        _lstOrders.forEach((item: Order) => {
          item.items.forEach((element: ShoppingCartItem) => {
            productOrderItems.push({ name: element.title, value: element.totalPrice });
          });
        });
        _lstOrders.forEach((element: Order) => {
          userItems.push({ userId: element.userId, name: element.shippingDetails.name, value: element.amount });
        });
        const calculatedUserItems = userItems.reduce((acc, item) => {
          let accItem = acc.find((ai: any) => ai.userId === item.userId);
          if (accItem) {
            accItem.value += item.value
          } else {
            acc.push(item)
          }
          return acc;
        }, [])

        this.saleUserData = [...calculatedUserItems];

        const calculatedProductOrderItems = productOrderItems.reduce((acc, item) => {
          let accItem = acc.find((ai: any) => ai.name === item.name);
          if (accItem) {
            accItem.value += item.value
          }
          else {
            acc.push(item)
          }
          return acc;
        }, [])

        this.saleProductData = [...calculatedProductOrderItems];
        this.saleProductDataInput = { data: this.saleProductData, multiSeries: false, seriesCount: 1, xAxis: 'name', yAxis: 'value' };
        this.loader = true;
      });
  }
}
