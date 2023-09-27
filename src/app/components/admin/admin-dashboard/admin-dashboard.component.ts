import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { ShoppingCartItem } from 'src/app/models/shopping-cart-item';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public saleProductDataInput: any;
  public loader: boolean = false;
  saleProductData: any[] = [];
  saleUserData: any[] = [];
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    let productOrderItems: any[] = [];
    let userItems: any[] = [];
    this.orderService.getAdminOrders()
      .subscribe(response => {

        let _lstOrders = response.map((data) => {
          return {
            id: data.payload.doc.id,
            ...data.payload.doc.data() as Order
          }
        });

        //Forming the product data
        _lstOrders.forEach((item: Order) => {
          item.items.forEach((element: ShoppingCartItem) => {
            productOrderItems.push({ name: element.title, value: element.totalPrice });
          });
        });

        _lstOrders.forEach((element: Order) => {
          userItems.push({ userId: element.userId, name: element.shippingDetails.name, value: element.amount });
        });

        const calculatedUserItems = userItems.reduce((acc, item) => {

          let accItem = acc.find((ai: any) => ai.userId === item.userId)

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