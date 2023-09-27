import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderDetail: Order = new Order();

  constructor(private orderService: OrderService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe(order => {
      this.orderDetail = order as Order;
    });
  }
  redirectToOrdersPage() {
    let viewFrom = this.route.snapshot.queryParamMap.get('viewFrom');
    if (viewFrom === 'admin') {
      this.router.navigate(['/admin/orders']);
    }
    else {
      this.router.navigate(['/my-orders']);
    }
  }
}
